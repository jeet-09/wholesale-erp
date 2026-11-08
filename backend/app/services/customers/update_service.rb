module Customers
  class UpdateService < ApplicationService
    def initialize(customer:, params:)
      @customer = customer
      @params = params
    end

    def call
      if @customer.update(@params)
        success(Api::V1::CustomerSerializer.new(@customer).as_json)
      else
        failure(@customer.errors.full_messages)
      end
    end
  end
end
