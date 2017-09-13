class AddOrderNumberToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :order_num, :integer
  end
end
