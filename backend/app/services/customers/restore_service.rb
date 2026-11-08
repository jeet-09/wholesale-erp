module Customers
  # Undo archive — customer can receive orders and appear in default lists again.
  class RestoreService < ApplicationService
    def initialize(customer:)
      @customer = customer
    end

    def call
      if @customer.update(active: true)
        success(Api::V1::CustomerSerializer.new(@customer).as_json)
      else
        failure(@customer.errors.full_messages)
      end
    end
  end
end
