# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_11_08_070140) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "customer_groups", force: :cascade do |t|
    t.string "name", null: false
    t.string "code", null: false
    t.string "abbreviation"
    t.text "notes"
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_customer_groups_on_code", unique: true
  end

  create_table "customers", force: :cascade do |t|
    t.bigint "customer_group_id"
    t.string "customer_type", default: "individual", null: false
    t.string "restaurant_name", null: false
    t.string "account_name", null: false
    t.string "customer_code", null: false
    t.string "abbreviation", null: false
    t.string "contact_person"
    t.string "mobile"
    t.string "email"
    t.text "billing_address"
    t.text "delivery_address"
    t.string "city"
    t.string "state"
    t.string "gstin"
    t.decimal "opening_balance", precision: 15, scale: 2, default: "0.0", null: false
    t.string "balance_type", default: "debit", null: false
    t.string "payment_terms"
    t.text "notes"
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbreviation"], name: "index_customers_on_abbreviation"
    t.index ["active"], name: "index_customers_on_active"
    t.index ["customer_code"], name: "index_customers_on_customer_code", unique: true
    t.index ["customer_group_id"], name: "index_customers_on_customer_group_id"
  end

  create_table "product_categories", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.integer "position", default: 0, null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_product_categories_on_slug", unique: true
  end

  create_table "product_prices", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.bigint "customer_id"
    t.bigint "customer_group_id"
    t.decimal "price", precision: 15, scale: 2, null: false
    t.datetime "effective_from", null: false
    t.datetime "effective_to"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_group_id"], name: "index_product_prices_on_customer_group_id"
    t.index ["customer_id"], name: "index_product_prices_on_customer_id"
    t.index ["product_id", "customer_group_id", "effective_from"], name: "index_product_prices_on_product_group_effective"
    t.index ["product_id", "customer_id", "effective_from"], name: "index_product_prices_on_product_customer_effective"
    t.index ["product_id"], name: "index_product_prices_on_product_id"
  end

  create_table "product_units", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbreviation", null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_product_units_on_name", unique: true
  end

  create_table "products", force: :cascade do |t|
    t.bigint "product_category_id", null: false
    t.bigint "product_unit_id", null: false
    t.string "name", null: false
    t.string "product_code", null: false
    t.string "item_type"
    t.decimal "default_selling_price", precision: 15, scale: 2, default: "0.0", null: false
    t.decimal "purchase_price", precision: 15, scale: 2, default: "0.0", null: false
    t.decimal "stock_quantity", precision: 15, scale: 3, default: "0.0", null: false
    t.decimal "net_loss_percentage", precision: 5, scale: 2, default: "0.0", null: false
    t.string "tax_category"
    t.text "description"
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_products_on_active"
    t.index ["name"], name: "index_products_on_name"
    t.index ["product_category_id"], name: "index_products_on_product_category_id"
    t.index ["product_code"], name: "index_products_on_product_code", unique: true
    t.index ["product_unit_id"], name: "index_products_on_product_unit_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "name", null: false
    t.string "role", default: "staff", null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "customers", "customer_groups"
  add_foreign_key "product_prices", "customer_groups"
  add_foreign_key "product_prices", "customers"
  add_foreign_key "product_prices", "products"
  add_foreign_key "products", "product_categories"
  add_foreign_key "products", "product_units"
end
