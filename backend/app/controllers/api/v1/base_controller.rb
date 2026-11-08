module Api
  module V1
    class BaseController < ApplicationController
      include Authentication

      rescue_from ActiveRecord::RecordNotFound do |e|
        render json: {
          success: false,
          errors: [{ code: "not_found", message: e.message }]
        }, status: :not_found
      end

      private

      def render_result(result, success_status: :ok, failure_status: :unprocessable_entity)
        if result.success?
          render json: { success: true, data: result.data }, status: success_status
        else
          render json: { success: false, errors: result.errors }, status: failure_status
        end
      end
    end
  end
end
