module Products
  class UpdateService < ApplicationService
    def initialize(product:, params:)
      @product = product
      @params = params
    end

    def call
      if @product.update(@params)
        success(Api::V1::ProductSerializer.new(@product).as_json)
      else
        failure(@product.errors.full_messages)
      end
    end
  end
end
