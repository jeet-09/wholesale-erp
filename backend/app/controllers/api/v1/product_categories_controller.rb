module Api
  module V1
    class ProductCategoriesController < BaseController
      def index
        data = ProductCategory.active.order(:position, :name).map do |c|
          { id: c.id, name: c.name, slug: c.slug }
        end
        render json: { success: true, data: data }
      end
    end
  end
end
