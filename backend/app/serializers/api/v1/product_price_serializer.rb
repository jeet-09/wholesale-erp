module Api
  module V1
    class ProductPriceSerializer
      def initialize(price)
        @price = price
      end

      def as_json
        {
          id: @price.id,
          product_id: @price.product_id,
          customer_id: @price.customer_id,
          customer_group_id: @price.customer_group_id,
          customer_name: @price.customer&.account_name,
          customer_group_name: @price.customer_group&.name,
          price: @price.price.to_s("F"),
          effective_from: @price.effective_from.iso8601,
          effective_to: @price.effective_to&.iso8601
        }
      end
    end
  end
end
