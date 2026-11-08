module Products
  # Priority: branch customer price -> group price -> default product price.
  class PriceForCustomerQuery
    def initialize(product:, customer:)
      @product = product
      @customer = customer
    end

    def call
      branch_price = current_price_scope.find_by(customer_id: @customer.id)
      return price_result(branch_price.price, "customer") if branch_price

      if @customer.customer_group_id.present?
        group_price = current_price_scope.find_by(customer_group_id: @customer.customer_group_id)
        return price_result(group_price.price, "customer_group") if group_price
      end

      price_result(@product.default_selling_price, "default")
    end

    private

    def current_price_scope
      ProductPrice.current.where(product_id: @product.id)
    end

    def price_result(amount, source)
      {
        product_id: @product.id,
        customer_id: @customer.id,
        price: amount.to_s("F"),
        source: source
      }
    end
  end
end
