# == Schema Information
#
# Table name: admins
#
#  id                     :integer          not null, primary key
#  email                  :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  encrypted_password     :string           default(""), not null
#  remember_created_at    :datetime
#  reset_password_token   :string
#  reset_password_sent_at :string
#  current_password       :string
#  password_confirmation  :string
#

class Admin < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable :database_authenticatable, :recoverable, :rememberable, :trackable,
  devise :validatable, :database_authenticatable, :recoverable

  validates_email_format_of :email
  validates :email, uniqueness: true

  def destroy
    return false if Admin.count < 2
    super
  end

  def correct_password?(input)
    return true if self.password == input
  end
end
