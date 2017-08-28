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
