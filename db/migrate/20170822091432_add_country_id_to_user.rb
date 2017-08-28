class AddCountryIdToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :country_id, :string
  end
end
