module ProductPrices
  class UpdateService < ApplicationService
    def initialize(price:, params:)
      @price = price
      @params = params
    end

    def call
      if @price.update(@params)
        success(Api::V1::ProductPriceSerializer.new(@price).as_json)
      else
        failure(@price.errors.full_messages)
      end
    end
  end
end
