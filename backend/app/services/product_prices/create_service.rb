module ProductPrices
  class CreateService < ApplicationService
    def initialize(params:)
      @params = params
    end

    def call
      price = ProductPrice.new(@params)
      price.effective_from ||= Time.current

      if price.save
        success(Api::V1::ProductPriceSerializer.new(price).as_json)
      else
        failure(price.errors.full_messages)
      end
    end
  end
end
