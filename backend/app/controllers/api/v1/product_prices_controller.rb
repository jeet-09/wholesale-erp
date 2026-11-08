module Api
  module V1
    class ProductPricesController < BaseController
      def index
        scope = ProductPrice.includes(:product, :customer, :customer_group).order(created_at: :desc)
        scope = scope.where(product_id: params[:product_id]) if params[:product_id].present?
        scope = scope.where(customer_id: params[:customer_id]) if params[:customer_id].present?
        scope = scope.where(customer_group_id: params[:customer_group_id]) if params[:customer_group_id].present?

        data = scope.limit(100).map { |p| ProductPriceSerializer.new(p).as_json }
        render json: { success: true, data: data }
      end

      def create
        result = ProductPrices::CreateService.call(params: price_params)
        render_result(result, success_status: :created)
      end

      def update
        price = ProductPrice.find(params[:id])
        result = ProductPrices::UpdateService.call(price: price, params: price_update_params)
        render_result(result)
      end

      def destroy
        price = ProductPrice.find(params[:id])
        result = ProductPrices::DestroyService.call(price: price)
        render_result(result)
      end

      private

      def price_params
        params.require(:product_price).permit(
          :product_id, :customer_id, :customer_group_id,
          :price, :effective_from, :effective_to
        )
      end

      def price_update_params
        params.require(:product_price).permit(:price)
      end
    end
  end
end
