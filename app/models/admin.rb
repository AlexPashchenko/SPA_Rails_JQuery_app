# == Schema Information
#
# Table name: admins
#
#  id                  :integer          not null, primary key
#  email               :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  encrypted_password  :string           default(""), not null
#  remember_created_at :datetime
#

class Admin < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :recoverable, :rememberable, :trackable, :validatable

  validates_email_format_of :email
  validates :email, uniqueness: true

  def destroy
    return false if Admin.count < 2
    super
  end
end
