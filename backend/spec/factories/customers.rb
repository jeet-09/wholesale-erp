FactoryBot.define do
  factory :customer_group do
    sequence(:name) { |n| "Group #{n}" }
    sequence(:code) { |n| "GRP#{n}" }
    abbreviation { "GRP" }
    active { true }
  end

  factory :customer do
    association :customer_group, factory: :customer_group, strategy: :build
    customer_type { "branch" }
    sequence(:restaurant_name) { |n| "Restaurant #{n}" }
    sequence(:account_name) { |n| "Account #{n}" }
    sequence(:customer_code) { |n| "C#{n}" }
    sequence(:abbreviation) { |n| "A#{n}" }
    opening_balance { 0 }
    balance_type { "debit" }
    active { true }

    trait :individual do
      customer_type { "individual" }
      customer_group { nil }
    end
  end
end
