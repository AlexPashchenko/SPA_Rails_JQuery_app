require 'rails_helper'

RSpec.describe Country, type: :model do
  describe "Validation"
  
  it { should validate_presence_of (:title) }
  it { should validate_uniqueness_of (:title) }
  it { expect(build(:country)).to be_valid }

end
