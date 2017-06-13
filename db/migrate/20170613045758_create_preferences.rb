class CreatePreferences < ActiveRecord::Migration[5.1]
  def change
    create_table :preferences do |t|
      t.integer :height
      t.float :cat_preference

      t.timestamps
    end
  end
end
