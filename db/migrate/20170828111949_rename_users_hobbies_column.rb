class RenameUsersHobbiesColumn < ActiveRecord::Migration[5.0]
  def change
    rename_column :users_hobbies, :country_id, :hobby_id
  end
end
