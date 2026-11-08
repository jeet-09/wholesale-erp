# Basic login rate limiting (expanded in production hardening).
class Rack::Attack
  throttle("auth/login", limit: 10, period: 60) do |req|
    req.ip if req.path == "/api/v1/auth/login" && req.post?
  end
end

Rack::Attack.enabled = !Rails.env.test?

Rails.application.config.middleware.use Rack::Attack
