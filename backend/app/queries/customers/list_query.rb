module Customers
  class ListQuery
    def initialize(filters = {})
      @filters = filters.symbolize_keys
    end

    def call
      scope = Customer.includes(:customer_group).order(:account_name)
      # ActiveRecord relations are immutable — each where() returns a new scope.
      scope = apply_active(scope)
      scope = apply_equals(scope, :customer_code, @filters[:customer_code])
      scope = apply_equals(scope, :abbreviation, @filters[:abbreviation], exact: false)
      scope = apply_equals(scope, :account_name, @filters[:account_name], exact: false)
      scope = apply_equals(scope, :customer_type, @filters[:customer_type], exact: true)
      scope = apply_equals(scope, :city, @filters[:city], exact: false)
      scope = apply_group(scope)
      scope = apply_search(scope, @filters[:search])
      scope
    end

    private

    def apply_active(scope)
      raw = @filters[:active]
      return scope if raw.nil? || raw.to_s.strip == ""

      # Query string may arrive as "true"/"false" or as booleans after params parsing.
      if raw == true || raw.to_s.casecmp("true").zero?
        scope.where(active: true)
      elsif raw == false || raw.to_s.casecmp("false").zero?
        scope.where(active: false)
      else
        scope
      end
    end

    def apply_equals(scope, column, value, exact: false)
      return scope if value.blank?

      if exact
        scope.where(column => value)
      else
        scope.where("#{column} ILIKE ?", "%#{sanitize_like(value)}%")
      end
    end

    def apply_group(scope)
      return scope if @filters[:customer_group_id].blank?

      scope.where(customer_group_id: @filters[:customer_group_id])
    end

    def apply_search(scope, term)
      return scope if term.blank?

      t = "%#{sanitize_like(term)}%"
      scope.where(
        "account_name ILIKE :t OR customer_code ILIKE :t OR abbreviation ILIKE :t OR restaurant_name ILIKE :t",
        t: t
      )
    end

    def sanitize_like(value)
      value.to_s.strip.gsub(/[%_\\]/) { |m| "\\#{m}" }
    end
  end
end
