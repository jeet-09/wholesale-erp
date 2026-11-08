module Api
  module V1
    module Auth
      class MeController < BaseController
        def show
          render json: {
            success: true,
            data: Api::V1::UserSerializer.new(Current.user).as_json
          }
        end
      end
    end
  end
end
