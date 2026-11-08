class CreateCustomerGroups < ActiveRecord::Migration[8.1]
  def change
    create_table :customer_groups do |t|
      t.string :name, null: false
      t.string :code, null: false
      t.string :abbreviation
      t.text :notes
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :customer_groups, :code, unique: true
  end
end
