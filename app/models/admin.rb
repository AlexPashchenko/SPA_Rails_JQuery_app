class Admin < ApplicationRecord

 validates_email_format_of :email, :message => 'is not looking good'
 validates :password, confirmation: true
 validates :email, uniqueness: true
end
