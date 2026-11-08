# Session-based authentication for API requests (cookie store).
module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request!
  end

  private

  def authenticate_request!
    Current.user = current_user
    render_unauthorized unless Current.user&.active?
  end

  def current_user
    @current_user ||= User.active.find_by(id: session[:user_id]) if session[:user_id]
  end

  def render_unauthorized
    render json: {
      success: false,
      errors: [{ code: "unauthorized", message: "You must be logged in." }]
    }, status: :unauthorized
  end

  def skip_authentication
    skip_before_action :authenticate_request!
  end
end
