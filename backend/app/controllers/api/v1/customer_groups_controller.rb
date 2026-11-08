module Api
  module V1
    class CustomerGroupsController < BaseController
      def index
        groups = CustomerGroup.active.order(:name)
        data = groups.map { |g| CustomerGroupSerializer.new(g).as_json }
        render json: { success: true, data: data }
      end

      def create
        result = CustomerGroups::CreateService.call(params: group_params)
        render_result(result, success_status: :created)
      end

      private

      def group_params
        params.require(:customer_group).permit(:name, :code, :abbreviation, :notes, :active)
      end
    end
  end
end
