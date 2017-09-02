require 'rails_helper'
require "validates_email_format_of/rspec_matcher"

RSpec.describe Admin, type: :model do

  let(:admin) { FactoryGirl.create :admin }
   describe 'Validation' do
      it { should validate_presence_of(:email) }
      it { should validate_presence_of(:password) }
      it { should validate_email_format_of(:email) }
      it { expect(build(:admin)).to be_valid }

   end

  describe 'Instance method' do
    it { expect(admin.destroy).to be_in([true, false]) }

  end

end
