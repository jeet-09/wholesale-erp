FactoryBot.define do
  factory :product_category do
    sequence(:name) { |n| "Category #{n}" }
    sequence(:slug) { |n| "category-#{n}" }
    active { true }
  end

  factory :product_unit do
    sequence(:name) { |n| "Unit#{n}" }
    sequence(:abbreviation) { |n| "u#{n}" }
    active { true }
  end

  factory :product do
    association :product_category
    association :product_unit
    sequence(:name) { |n| "Product #{n}" }
    sequence(:product_code) { |n| "P#{n}" }
    default_selling_price { 10 }
    purchase_price { 8 }
    stock_quantity { 0 }
    active { true }
  end
end
