class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.references :product_category, null: false, foreign_key: true
      t.references :product_unit, null: false, foreign_key: true
      t.string :name, null: false
      t.string :product_code, null: false
      t.string :item_type
      t.decimal :default_selling_price, precision: 15, scale: 2, default: 0, null: false
      t.decimal :purchase_price, precision: 15, scale: 2, default: 0, null: false
      t.decimal :stock_quantity, precision: 15, scale: 3, default: 0, null: false
      t.decimal :net_loss_percentage, precision: 5, scale: 2, default: 0, null: false
      t.string :tax_category
      t.text :description
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :products, :product_code, unique: true
    add_index :products, :name
    add_index :products, :active
  end
end
