# Request-scoped attributes (see Authentication concern).
class Current < ActiveSupport::CurrentAttributes
  attribute :user
end
