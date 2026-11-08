module Api
  module V1
    module Auth
      class SessionsController < BaseController
        skip_before_action :authenticate_request!, only: :create

        # POST /api/v1/auth/login
        def create
          result = ::Auth::LoginService.call(
            email: session_params[:email],
            password: session_params[:password],
            session: session
          )
          render_result(result, success_status: :created, failure_status: :unauthorized)
        end

        # POST /api/v1/auth/logout
        def destroy
          result = ::Auth::LogoutService.call(session: session)
          render_result(result)
        end

        private

        def session_params
          params.permit(:email, :password)
        end
      end
    end
  end
end
