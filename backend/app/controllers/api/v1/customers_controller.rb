module Api
  module V1
    class CustomersController < BaseController
      def index
        customers = Customers::ListQuery.new(search: params[:search], active: truthy?(params.fetch(:active, "true"))).call
        data = customers.map { |c| CustomerSerializer.new(c).as_json }
        render json: { success: true, data: data }
      end

      def show
        customer = Customer.find(params[:id])
        render json: { success: true, data: CustomerSerializer.new(customer).as_json }
      end

      def create
        result = Customers::CreateService.call(params: customer_params)
        render_result(result, success_status: :created)
      end

      private

      def customer_params
        params.require(:customer).permit(
          :customer_group_id, :customer_type, :restaurant_name, :account_name,
          :customer_code, :abbreviation, :contact_person, :mobile, :email,
          :billing_address, :delivery_address, :city, :state, :gstin,
          :opening_balance, :balance_type, :payment_terms, :notes, :active
        )
      end

      def truthy?(value)
        ActiveModel::Type::Boolean.new.cast(value)
      end
    end
  end
end
