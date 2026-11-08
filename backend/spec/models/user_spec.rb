require "rails_helper"

RSpec.describe User, type: :model do
  it "requires a unique email" do
    create(:user, email: "dup@example.com")
    duplicate = build(:user, email: "dup@example.com")
    expect(duplicate).not_to be_valid
  end

  it "authenticates with password" do
    user = create(:user, password: "securepass1")
    expect(user.authenticate("securepass1")).to eq(user)
  end
end
