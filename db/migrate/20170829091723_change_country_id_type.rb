class ChangeCountryIdType < ActiveRecord::Migration[5.0]
  def change
    change_column :users, :country_id, 'integer USING CAST(country_id AS integer)'
  end
end
