class AddCurrentPasswordForAdmin < ActiveRecord::Migration[5.0]
  def change
    add_column :admins, :current_password, :string
    add_column :admins, :password_confirmation, :string
  end
end
