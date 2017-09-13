require 'rails_helper'

RSpec.describe CountriesController, type: :controller do

  it { should use_before_action(:authenticate_admin!) }
end
