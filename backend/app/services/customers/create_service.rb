module Customers
  class CreateService < ApplicationService
    def initialize(params:)
      @params = params
    end

    def call
      customer = Customer.new(@params)
      if customer.save
        success(Api::V1::CustomerSerializer.new(customer).as_json)
      else
        failure(customer.errors.full_messages)
      end
    end
  end
end
