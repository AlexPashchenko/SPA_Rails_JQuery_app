class AddPasswordTokenForAdmin < ActiveRecord::Migration[5.0]
  def change
    add_column :admins, :reset_password_token, :string
  end
end
