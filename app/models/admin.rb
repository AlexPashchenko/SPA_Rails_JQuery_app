class Admin < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  before_destroy :check_last?
  devise :database_authenticatable, :recoverable, :rememberable, :trackable, :validatable

  validates_email_format_of :email
  validates :email, uniqueness: true

  def check_last?
    if Admin.count < 2
      raise "Last admin can't be destroyed!"
      return false
    end
  end
end
