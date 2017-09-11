# == Schema Information
#
# Table name: hobbies
#
#  id         :integer          not null, primary key
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Hobby < ApplicationRecord
   has_and_belongs_to_many :users,  join_table: "users_hobbies"

   validates :title, presence: true
   validates :title, uniqueness: true
   
end
