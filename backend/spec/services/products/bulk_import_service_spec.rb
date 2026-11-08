require "rails_helper"

RSpec.describe Products::BulkImportService do
  let!(:category) do
    ProductCategory.find_or_create_by!(slug: "indian-vegetables") { |c| c.name = "Indian vegetables" }
  end
  let!(:unit) { ProductUnit.find_or_create_by!(name: "Kg") { |u| u.abbreviation = "kg" } }

  it "imports a new product from CSV" do
    csv = <<~CSV
      product_code,name,category_slug,unit_name,default_selling_price,purchase_price,stock_quantity
      IMP-001,Imported Okra,indian-vegetables,Kg,55,45,10
    CSV

    result = described_class.call(csv_string: csv, update_existing: true)
    expect(result).to be_success
    expect(result.data[:created]).to eq(1)
    expect(Product.find_by(product_code: "IMP-001")).to be_present
  end
end
