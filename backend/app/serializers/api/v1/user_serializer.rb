module Api
  module V1
    class UserSerializer
      def initialize(user)
        @user = user
      end

      def as_json
        {
          id: @user.id,
          email: @user.email,
          name: @user.name,
          role: @user.role,
          active: @user.active
        }
      end
    end
  end
end
