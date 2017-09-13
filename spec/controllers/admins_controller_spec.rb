require 'rails_helper'

RSpec.describe AdminsController, type: :controller do

  it { should use_before_action(:authenticate_admin!) }

end
