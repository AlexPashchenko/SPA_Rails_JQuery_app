class RemovePAsswordFromAdmin < ActiveRecord::Migration[5.0]
  def change
    remove_column :admins, :password
  end
end
