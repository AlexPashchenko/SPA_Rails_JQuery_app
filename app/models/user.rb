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
#  country_id :integer
#

class User < ApplicationRecord
  extend Enumerize

  has_and_belongs_to_many :hobbies,  join_table: "users_hobbies"
  belongs_to :country
  accepts_nested_attributes_for :hobbies

  validates :first_name, :last_name, :age, :country_id, :gender, presence: true
  validates_numericality_of :age,  only_integer: true
  enumerize :gender, in: [:male, :female]

  delegate :country_name, to: :country
  attr_accessor :country_name

  def user_hobbies
    hobby_titles=[]
    self.hobbies.map  do |hobby|
      hobby_titles << hobby.title
    end
    hobby_titles
  end
end
