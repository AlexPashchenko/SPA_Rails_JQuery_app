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

require 'test_helper'

class AdminTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
