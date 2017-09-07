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

require 'test_helper'

class AdminTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
