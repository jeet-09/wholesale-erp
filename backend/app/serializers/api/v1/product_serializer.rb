module Api
  module V1
    class ProductSerializer
      def initialize(product)
        @product = product
      end

      def as_json
        {
          id: @product.id,
          name: @product.name,
          product_code: @product.product_code,
          product_category_id: @product.product_category_id,
          product_unit_id: @product.product_unit_id,
          category: @product.product_category.name,
          unit: @product.product_unit.abbreviation,
          description: @product.description,
          net_loss_percentage: @product.net_loss_percentage.to_s("F"),
          default_selling_price: @product.default_selling_price.to_s("F"),
          purchase_price: @product.purchase_price.to_s("F"),
          stock_quantity: @product.stock_quantity.to_s("F"),
          item_type: @product.item_type,
          tax_category: @product.tax_category,
          active: @product.active
        }
      end
    end
  end
end
