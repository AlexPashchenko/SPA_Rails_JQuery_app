class CreateUserHobbies < ActiveRecord::Migration[5.0]
  def change
    create_table :users_hobbies, id: false do |t|
      t.belongs_to :user, index: true
      t.belongs_to :country, index: true
      t.timestamps
    end
  end
end
