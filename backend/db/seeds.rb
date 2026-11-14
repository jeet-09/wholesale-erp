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

# Item Type labels match EzzyBilling: Indian, Exotic, Fruits, Imported, Others
categories = [
  ["Indian", "indian-vegetables"],
  ["Exotic", "exotic-vegetables"],
  ["Fruits", "fruits"],
  ["Imported", "imported-products"],
  ["Others", "others"]
]
categories.each_with_index do |(name, slug), index|
  cat = ProductCategory.find_or_initialize_by(slug: slug)
  cat.name = name
  cat.position = index
  cat.active = true if cat.new_record?
  cat.save!
end

# Item Unit — names/abbreviations familiar from EzzyBilling (Kg., pkg., no., box)
[
  ["Kg", "Kg."],
  ["Gram", "g"],
  ["Piece", "no."],
  ["Box", "box"],
  ["Packet", "pkg."],
  ["Bunch", "Bndl"],
  ["Dozen", "Doz"],
  ["Litre", "L"]
].each do |unit_name, abbrev|
  ProductUnit.find_or_create_by!(name: unit_name) do |u|
    u.abbreviation = abbrev
  end
end

Rails.logger.info "Seeded product categories and units"

load Rails.root.join("db/seeds/demo_data.rb")
