require 'rails_helper'
require "validates_email_format_of/rspec_matcher"

RSpec.describe Admin, type: :model do

   describe 'Validation' do
      it { should validate_presence_of(:email) }
      it { should validate_presence_of(:password) }
      it { should validate_confirmation_of (:password) }
      it { expect(build(:admin)).to be_valid }

   end

end
