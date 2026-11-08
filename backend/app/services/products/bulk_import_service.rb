require "csv"

module Products
  # CSV bulk import: create or update by product_code.
  class BulkImportService < ApplicationService
    REQUIRED_HEADERS = %w[product_code name category_slug unit_name default_selling_price].freeze

    def initialize(csv_string:, update_existing: true)
      @csv_string = csv_string
      @update_existing = update_existing
    end

    def call
      parsed = parse_rows
      return parsed if parsed.failure?

      rows = parsed.data
      summary = { created: 0, updated: 0, errors: [] }

      rows.each_with_index do |row, index|
        line = index + 2
        result = import_row(row)
        if result[:error]
          summary[:errors] << { line: line, message: result[:error] }
        elsif result[:created]
          summary[:created] += 1
        elsif result[:updated]
          summary[:updated] += 1
        end
      end

      success(summary)
    rescue CSV::MalformedCSVError => e
      failure([{ code: "invalid_csv", message: e.message }])
    end

    private

    def parse_rows
      table = CSV.parse(@csv_string, headers: true, strip: true)
      headers = table.headers.compact.map { |h| h.to_s.strip.downcase }
      missing = REQUIRED_HEADERS - headers
      if missing.any?
        return failure([{ code: "missing_headers", message: "Missing columns: #{missing.join(', ')}" }])
      end

      data = table.map do |row|
        REQUIRED_HEADERS.index_with { |h| row[h]&.strip }
          .merge(
            "purchase_price" => row["purchase_price"]&.strip,
            "stock_quantity" => row["stock_quantity"]&.strip
          )
      end
      success(data)
    end

    def import_row(row)
      code = row["product_code"]
      return { error: "product_code is blank" } if code.blank?

      category = ProductCategory.find_by(slug: row["category_slug"])
      return { error: "Unknown category_slug: #{row['category_slug']}" } unless category

      unit = ProductUnit.find_by(name: row["unit_name"]) ||
             ProductUnit.find_by(abbreviation: row["unit_name"])
      return { error: "Unknown unit: #{row['unit_name']}" } unless unit

      attrs = {
        name: row["name"],
        product_category: category,
        product_unit: unit,
        default_selling_price: decimal(row["default_selling_price"], 0),
        purchase_price: decimal(row["purchase_price"], decimal(row["default_selling_price"], 0) * 0.85),
        stock_quantity: decimal(row["stock_quantity"], 0),
        active: true
      }

      product = Product.find_by(product_code: code)
      if product
        return { error: "Product #{code} exists (skip or enable update)" } unless @update_existing

        product.update!(attrs)
        { updated: true }
      else
        Product.create!(attrs.merge(product_code: code))
        { created: true }
      end
    rescue ActiveRecord::RecordInvalid => e
      { error: e.record.errors.full_messages.join(", ") }
    end

    def decimal(value, default)
      return default if value.blank?

      BigDecimal(value.to_s)
    end
  end
end
