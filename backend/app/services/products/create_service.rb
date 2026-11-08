module Products
  class CreateService < ApplicationService
    def initialize(params:)
      @params = params
    end

    def call
      product = Product.new(@params)
      if product.save
        success(Api::V1::ProductSerializer.new(product).as_json)
      else
        failure(product.errors.full_messages)
      end
    end
  end
end
