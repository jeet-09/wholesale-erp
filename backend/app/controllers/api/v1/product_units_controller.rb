module Api
  module V1
    class ProductUnitsController < BaseController
      def index
        data = ProductUnit.active.order(:name).map do |u|
          { id: u.id, name: u.name, abbreviation: u.abbreviation }
        end
        render json: { success: true, data: data }
      end
    end
  end
end
