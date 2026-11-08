module Api
  module V1
    class CustomersController < BaseController
      def index
        customers = Customers::ListQuery.new(list_filters).call
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

      def update
        customer = Customer.find(params[:id])
        result = Customers::UpdateService.call(customer: customer, params: customer_params)
        render_result(result)
      end

      def archive
        customer = Customer.find(params[:id])
        result = Customers::ArchiveService.call(customer: customer)
        render_result(result)
      end

      def restore
        customer = Customer.find(params[:id])
        result = Customers::RestoreService.call(customer: customer)
        render_result(result)
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

      # Query string only — avoids "Unpermitted parameter: :customer" when the
      # client sends JSON Content-Type on GET and Rails adds an empty customer hash.
      def list_filters
        allowed = %i[
          search customer_code abbreviation account_name
          customer_type customer_group_id city active
        ]
        ActionController::Parameters.new(request.query_parameters)
          .permit(*allowed)
          .to_h
          .symbolize_keys
      end
    end
  end
end
