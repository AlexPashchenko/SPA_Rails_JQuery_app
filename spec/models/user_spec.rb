require 'rails_helper'
require 'faker'

RSpec.describe User, type: :model do
let(:user) { FactoryGirl.create :user }
let(:hobby) { FactoryGirl.create :hobby }
  describe 'Associations' do
    it { should belong_to(:country) }
    it { should have_and_belong_to_many(:hobbies)
      .join_table('users_hobbies')
    }
    it { should accept_nested_attributes_for(:hobbies) }
  end
  describe 'Validations' do
    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:last_name) }
    it { should validate_presence_of(:age) }
    it { should validate_presence_of(:country_id) }
    it { should validate_presence_of(:gender) }
    it { should validate_numericality_of(:age).only_integer  }
    it { expect(build(:user)).to be_valid }
  end

  # describe 'Instance' do
  #   it { expect(user.hobbies).to eq([hobby.title]) }
  # end
end
