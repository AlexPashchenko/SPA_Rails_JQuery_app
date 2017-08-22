class Admin < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :recoverable, :rememberable, :trackable, :validatable

 validates_email_format_of :email, :message => 'is not looking good'
 validates :password, confirmation: true
 validates :email, uniqueness: true
end
