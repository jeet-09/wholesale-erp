require "rails_helper"

RSpec.describe "Api::V1::Auth", type: :request do
  let!(:user) { create(:user, email: "admin@test.com", password: "password123", role: "admin") }

  describe "GET /api/v1/health" do
    it "returns ok" do
      get "/api/v1/health"
      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body.dig("data", "status")).to eq("ok")
    end
  end

  describe "POST /api/v1/auth/login" do
    it "creates a session for valid credentials" do
      post "/api/v1/auth/login", params: { email: user.email, password: "password123" }
      expect(response).to have_http_status(:created)
      body = JSON.parse(response.body)
      expect(body["success"]).to be(true)
      expect(body.dig("data", "email")).to eq(user.email)
    end

    it "rejects invalid credentials" do
      post "/api/v1/auth/login", params: { email: user.email, password: "wrong" }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "authenticated routes" do
    before do
      post "/api/v1/auth/login", params: { email: user.email, password: "password123" }
    end

    it "returns current user" do
      get "/api/v1/auth/me"
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).dig("data", "id")).to eq(user.id)
    end

    it "logs out" do
      post "/api/v1/auth/logout"
      expect(response).to have_http_status(:ok)
      get "/api/v1/auth/me"
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
