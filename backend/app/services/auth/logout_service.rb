module Auth
  class LogoutService < ApplicationService
    def initialize(session:)
      @session = session
    end

    def call
      @session.delete(:user_id)
      success({ logged_out: true })
    end
  end
end
