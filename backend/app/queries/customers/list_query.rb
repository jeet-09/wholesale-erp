module Customers
  class ListQuery
    def initialize(search: nil, active: true)
      @search = search
      @active = active
    end

    def call
      scope = Customer.includes(:customer_group).order(:account_name)
      scope = scope.where(active: true) if @active
      if @search.present?
        term = "%#{@search.strip}%"
        scope = scope.where(
          "account_name ILIKE :t OR customer_code ILIKE :t OR abbreviation ILIKE :t OR restaurant_name ILIKE :t",
          t: term
        )
      end
      scope
    end
  end
end
