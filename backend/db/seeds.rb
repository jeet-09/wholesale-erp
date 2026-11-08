# Development admin user — change password before production.
admin = User.find_or_initialize_by(email: "admin@kisantraders.local")
admin.assign_attributes(
  name: "System Administrator",
  role: "admin",
  active: true,
  password: ENV.fetch("SEED_ADMIN_PASSWORD", "ChangeMe123!")
)
admin.save!

Rails.logger.info "Seeded admin user: #{admin.email}"

categories = [
  ["Indian vegetables", "indian-vegetables"],
  ["Exotic vegetables", "exotic-vegetables"],
  ["Fruits", "fruits"],
  ["Imported products", "imported-products"],
  ["Others", "others"]
]
categories.each_with_index do |(name, slug), index|
  ProductCategory.find_or_create_by!(slug: slug) { |c| c.name = name; c.position = index }
end

%w[Kg Gram Piece Box Packet Bunch Dozen Litre].each do |unit_name|
  ProductUnit.find_or_create_by!(name: unit_name) do |u|
    u.abbreviation = unit_name == "Kg" ? "kg" : unit_name.downcase[0..2]
  end
end

Rails.logger.info "Seeded product categories and units"

load Rails.root.join("db/seeds/demo_data.rb")
