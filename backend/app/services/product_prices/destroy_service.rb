module ProductPrices
  # Removing the override makes the customer use group or default catalogue price.
  class DestroyService < ApplicationService
    def initialize(price:)
      @price = price
    end

    def call
      if @price.destroy
        success({ id: @price.id })
      else
        failure(@price.errors.full_messages)
      end
    end
  end
end
