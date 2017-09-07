# == Schema Information
#
# Table name: countries
#
#  id         :integer          not null, primary key
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Country < ApplicationRecord
  has_many :users

  validates :title, presence: true
end
