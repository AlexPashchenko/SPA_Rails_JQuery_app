# == Schema Information
#
# Table name: users
#
#  id         :integer          not null, primary key
#  first_name :string
#  last_name  :string
#  age        :integer
#  gender     :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  country_id :string
#

class User < ApplicationRecord
  extend Enumerize

  has_and_belongs_to_many :hobbies,  join_table: "users_hobbies"
  belongs_to :country

  validates :first_name, :last_name, :age, :country_id, :gender, presence: true
  validates_numericality_of :age,  only_integer: true

  enumerize :gender, in: [:male, :female]

end
