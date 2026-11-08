module Auth
  # Validates credentials and stores user id in the Rails session.
  class LoginService < ApplicationService
    def initialize(email:, password:, session:)
      @email = email
      @password = password
      @session = session
    end

    def call
      user = User.active.find_by(email: @email.to_s.strip.downcase)

      unless user&.authenticate(@password)
        return failure([{ code: "invalid_credentials", message: "Email or password is incorrect." }])
      end

      @session[:user_id] = user.id
      success(Api::V1::UserSerializer.new(user).as_json)
    end
  end
end
