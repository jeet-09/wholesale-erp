# Demo / test data for local UAT. Safe to re-run (find-or-create by stable codes).
return if ENV["SEED_DEMO_DATA"] == "false"

Rails.logger.info "Seeding demo customers, products, and sample pricing…"

# --- Staff user (optional second login) ---
staff = User.find_or_initialize_by(email: "staff@kisantraders.local")
staff.assign_attributes(
  name: "Order Entry Staff",
  role: "staff",
  active: true,
  password: ENV.fetch("SEED_STAFF_PASSWORD", "ChangeMe123!")
)
staff.save!

# --- Franchise group + branches (daily matrix column abbreviations) ---
butterfly = CustomerGroup.find_or_create_by!(code: "BFLY") do |g|
  g.name = "Butterfly Hospitality"
  g.abbreviation = "BFLY"
  g.notes = "Demo franchise group"
end

branches = [
  { code: "BFBAN", abbrev: "BF", name: "Butterfly Bandra", restaurant: "Butterfly Bandra" },
  { code: "BFAND", abbrev: "BFA", name: "Butterfly Andheri", restaurant: "Butterfly Andheri" },
  { code: "BFPOW", abbrev: "BFP", name: "Butterfly Powai", restaurant: "Butterfly Powai" },
  { code: "BFTHN", abbrev: "BFT", name: "Butterfly Thane", restaurant: "Butterfly Thane" }
]

branches.each do |b|
  Customer.find_or_create_by!(customer_code: b[:code]) do |c|
    c.customer_group = butterfly
    c.customer_type = "branch"
    c.restaurant_name = b[:restaurant]
    c.account_name = b[:name]
    c.abbreviation = b[:abbrev]
    c.contact_person = "Store Manager"
    c.mobile = "9876500001"
    c.city = "Mumbai"
    c.state = "Maharashtra"
    c.opening_balance = 0
    c.balance_type = "debit"
    c.payment_terms = "7 days"
    c.active = true
  end
end

# --- Individual restaurants ---
individuals = [
  {
    code: "AMK01", abbrev: "AMK", account: "Amar Kitchen",
    restaurant: "Amar Kitchen", city: "Mumbai", balance: 5000
  },
  {
    code: "GTR01", abbrev: "GTR", account: "Green Table Restaurant",
    restaurant: "Green Table", city: "Mumbai", balance: 2500
  },
  {
    code: "SPV01", abbrev: "SPV", account: "Spice Villa",
    restaurant: "Spice Villa Hotel", city: "Thane", balance: 0
  }
]

individuals.each do |row|
  Customer.find_or_create_by!(customer_code: row[:code]) do |c|
    c.customer_type = "individual"
    c.restaurant_name = row[:restaurant]
    c.account_name = row[:account]
    c.abbreviation = row[:abbrev]
    c.contact_person = "Purchase Manager"
    c.mobile = "9876512345"
    c.email = "#{row[:abbrev].downcase}@demo.local"
    c.city = row[:city]
    c.state = "Maharashtra"
    c.opening_balance = row[:balance]
    c.balance_type = "debit"
    c.payment_terms = "15 days"
    c.active = true
  end
end

# --- Product catalogue sample (representative set for matrix / orders testing) ---
indian = ProductCategory.find_by!(slug: "indian-vegetables")
exotic = ProductCategory.find_by!(slug: "exotic-vegetables")
fruits = ProductCategory.find_by!(slug: "fruits")
kg = ProductUnit.find_by!(name: "Kg")
pcs = ProductUnit.find_by!(name: "Piece")
bun = ProductUnit.find_by!(name: "Bunch")

demo_products = [
  { code: "VEG-TOM-L", name: "Tomato Big", category: indian, unit: kg, price: 45 },
  { code: "VEG-CAB", name: "Cabbage", category: indian, unit: kg, price: 28 },
  { code: "VEG-BRT", name: "Beetroot", category: indian, unit: kg, price: 55 },
  { code: "VEG-GIN", name: "Ginger", category: indian, unit: kg, price: 180 },
  { code: "VEG-ONR", name: "Onion Red", category: indian, unit: kg, price: 32 },
  { code: "VEG-POT", name: "Potato", category: indian, unit: kg, price: 30 },
  { code: "VEG-CAR", name: "Carrot", category: indian, unit: kg, price: 48 },
  { code: "VEG-CAP", name: "Capsicum Green", category: indian, unit: kg, price: 70 },
  { code: "VEG-CUC", name: "Cucumber", category: indian, unit: kg, price: 35 },
  { code: "VEG-COR", name: "Coriander", category: indian, unit: bun, price: 15 },
  { code: "EXO-BRO", name: "Broccoli", category: exotic, unit: kg, price: 220 },
  { code: "EXO-ZUC", name: "Zucchini Green", category: exotic, unit: kg, price: 160 },
  { code: "EXO-ASP", name: "Asparagus", category: exotic, unit: bun, price: 350 },
  { code: "FRT-BAN", name: "Banana Robusta", category: fruits, unit: kg, price: 55 },
  { code: "FRT-PAP", name: "Papaya", category: fruits, unit: pcs, price: 60 },
  { code: "FRT-APP", name: "Apple Shimla", category: fruits, unit: kg, price: 180 },
  { code: "VEG-GAR", name: "Garlic", category: indian, unit: kg, price: 140 },
  { code: "VEG-LEM", name: "Lemon", category: indian, unit: kg, price: 90 },
  { code: "VEG-CHL", name: "Green Chilli", category: indian, unit: kg, price: 80 },
  { code: "VEG-SPN", name: "Spinach", category: indian, unit: bun, price: 20 }
]

demo_products.each do |row|
  Product.find_or_create_by!(product_code: row[:code]) do |p|
    p.name = row[:name]
    p.product_category = row[:category]
    p.product_unit = row[:unit]
    p.default_selling_price = row[:price]
    p.purchase_price = (row[:price] * 0.85).round(2)
    p.stock_quantity = 100
    p.item_type = "vegetable"
    p.tax_category = "exempt"
    p.active = true
  end
end

# Branch-specific price: Tomato for Amar Kitchen (AMK)
amk = Customer.find_by!(customer_code: "AMK01")
tomato = Product.find_by!(product_code: "VEG-TOM-L")
unless ProductPrice.exists?(product: tomato, customer: amk)
  ProductPrice.create!(
    product: tomato,
    customer: amk,
    price: 42,
    effective_from: 1.month.ago
  )
end

# Group price: Cabbage for whole Butterfly group
cabbage = Product.find_by!(product_code: "VEG-CAB")
unless ProductPrice.exists?(product: cabbage, customer_group: butterfly)
  ProductPrice.create!(
    product: cabbage,
    customer_group: butterfly,
    price: 26,
    effective_from: 1.month.ago
  )
end

Rails.logger.info "Demo seed complete: #{Customer.count} customers, #{Product.count} products, #{User.count} users"
