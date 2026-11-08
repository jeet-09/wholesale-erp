class CreateProductPrices < ActiveRecord::Migration[8.1]
  def change
    create_table :product_prices do |t|
      t.references :product, null: false, foreign_key: true
      t.references :customer, foreign_key: true
      t.references :customer_group, foreign_key: true
      t.decimal :price, precision: 15, scale: 2, null: false
      t.datetime :effective_from, null: false
      t.datetime :effective_to
      t.timestamps
    end

    add_index :product_prices, %i[product_id customer_id effective_from],
              name: "index_product_prices_on_product_customer_effective"
    add_index :product_prices, %i[product_id customer_group_id effective_from],
              name: "index_product_prices_on_product_group_effective"
  end
end
