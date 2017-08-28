class User < ApplicationRecord
  extend Enumerize

  has_and_belongs_to_many :hobbies
  belongs_to :country

  validates :first_name, :last_name, :age, :country_id, :gender, presence: true
  validates_numericality_of :age,  only_integer: true

  enumerize :gender, in: [:male, :female]

end
