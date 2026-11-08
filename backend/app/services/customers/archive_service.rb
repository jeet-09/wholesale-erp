module Customers
  # Soft archive — sets active false (financial history preserved).
  class ArchiveService < ApplicationService
    def initialize(customer:)
      @customer = customer
    end

    def call
      if @customer.update(active: false)
        success(Api::V1::CustomerSerializer.new(@customer).as_json)
      else
        failure(@customer.errors.full_messages)
      end
    end
  end
end
