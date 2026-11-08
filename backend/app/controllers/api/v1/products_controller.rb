module Api
  module V1
    class ProductsController < BaseController
      def index
        products = Products::ListQuery.new(search: params[:search], active: truthy?(params.fetch(:active, "true"))).call
        data = products.map { |p| ProductSerializer.new(p).as_json }
        render json: { success: true, data: data }
      end

      def show
        product = Product.find(params[:id])
        render json: { success: true, data: ProductSerializer.new(product).as_json }
      end

      def create
        result = Products::CreateService.call(params: product_params)
        render_result(result, success_status: :created)
      end

      private

      def product_params
        params.require(:product).permit(
          :product_category_id, :product_unit_id, :name, :product_code, :item_type,
          :default_selling_price, :purchase_price, :stock_quantity, :net_loss_percentage,
          :tax_category, :description, :active
        )
      end

      def truthy?(value)
        ActiveModel::Type::Boolean.new.cast(value)
      end
    end
  end
end
