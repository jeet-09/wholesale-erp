class CreateProductCategoriesAndUnits < ActiveRecord::Migration[8.1]
  def change
    create_table :product_categories do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.integer :position, default: 0, null: false
      t.boolean :active, null: false, default: true
      t.timestamps
    end
    add_index :product_categories, :slug, unique: true

    create_table :product_units do |t|
      t.string :name, null: false
      t.string :abbreviation, null: false
      t.boolean :active, null: false, default: true
      t.timestamps
    end
    add_index :product_units, :name, unique: true
  end
end
