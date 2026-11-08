require "csv"

module Products
  module ImportTemplate
    module_function

    def to_csv
      CSV.generate(headers: true) do |csv|
        csv << %w[
          product_code
          name
          category_slug
          unit_name
          default_selling_price
          purchase_price
          stock_quantity
        ]
        csv << ["VEG-DEMO", "Demo Tomato", "indian-vegetables", "Kg", "45", "38", "100"]
      end
    end
  end
end
