class AddPasswordTokenSendAtForAdmin < ActiveRecord::Migration[5.0]
  def change
    add_column :admins, :reset_password_sent_at, :string
  end
end
