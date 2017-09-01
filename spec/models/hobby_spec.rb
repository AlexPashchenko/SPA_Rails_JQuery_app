require 'rails_helper'

RSpec.describe Hobby, type: :model do
  describe 'Validation'

  it { should validate_presence_of (:title) }
  it { should validate_uniqueness_of (:title) }

end
