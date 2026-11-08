module Api
  module V1
    class CustomerSerializer
      def initialize(customer)
        @customer = customer
      end

      def as_json
        {
          id: @customer.id,
          customer_type: @customer.customer_type,
          customer_group_id: @customer.customer_group_id,
          customer_group_name: @customer.customer_group&.name,
          restaurant_name: @customer.restaurant_name,
          account_name: @customer.account_name,
          customer_code: @customer.customer_code,
          abbreviation: @customer.abbreviation,
          contact_person: @customer.contact_person,
          mobile: @customer.mobile,
          email: @customer.email,
          billing_address: @customer.billing_address,
          delivery_address: @customer.delivery_address,
          city: @customer.city,
          state: @customer.state,
          gstin: @customer.gstin,
          opening_balance: @customer.opening_balance.to_s("F"),
          balance_type: @customer.balance_type,
          payment_terms: @customer.payment_terms,
          notes: @customer.notes,
          active: @customer.active
        }
      end
    end
  end
end
