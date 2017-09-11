class AddDefaulValueForUserOrder < ActiveRecord::Migration[5.0]
  def change
    change_column :users, :order_num, :integer, :default => 0
  end
end
