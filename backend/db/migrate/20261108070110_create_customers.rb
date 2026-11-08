class CreateCustomers < ActiveRecord::Migration[8.1]
  def change
    create_table :customers do |t|
      t.references :customer_group, foreign_key: true
      t.string :customer_type, null: false, default: "individual"
      t.string :restaurant_name, null: false
      t.string :account_name, null: false
      t.string :customer_code, null: false
      t.string :abbreviation, null: false
      t.string :contact_person
      t.string :mobile
      t.string :email
      t.text :billing_address
      t.text :delivery_address
      t.string :city
      t.string :state
      t.string :gstin
      t.decimal :opening_balance, precision: 15, scale: 2, default: 0, null: false
      t.string :balance_type, null: false, default: "debit"
      t.string :payment_terms
      t.text :notes
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :customers, :customer_code, unique: true
    add_index :customers, :abbreviation
    add_index :customers, :active
  end
end
