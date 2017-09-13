require 'rails_helper'
require 'rspec/rails'
require 'devise'

RSpec.describe HobbiesController, type: :controller do
  Devise::Test::ControllerHelpers

  let(:hobby) { FactoryGirl.create :hobby }
  let(:admin) { FactoryGirl.create :admin }

  context 'callbacks' do
    it { should use_before_action(:authenticate_admin!) }
  end

  describe 'GET' do

    context '#index' do

      it "has an unauthorized status" do
        get :index, format: :json
        expect(response).to  have_http_status(:unauthorized)
      end
      it "has a success status" do
        sign_in admin
        get :index, format: :json
        expect(response).to have_http_status(:success)
      end
    end

    context '#show' do

      it "has an unauthorized status" do
        get :show, params: { id: hobby.id }, format: :json
        expect(response).to  have_http_status(:unauthorized)
      end

      it "has a success status" do
        sign_in admin
        get :show, params: { id: hobby.id }, format: :json
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe 'POST#create' do

    it "has a unauthorized status" do
      post :create, params: FactoryGirl.attributes_for(:hobby), format: :json
      expect(response).to  have_http_status(:unauthorized)
    end

    it "has a created status" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:hobby), format: :json
      expect(response).to  have_http_status(:created)
    end

    it "creates a new hobby" do
      sign_in admin
      expect {
        post :create, params: FactoryGirl.attributes_for(:hobby), format: :json
      }.to change(Hobby,:count).by(1)
    end
  end

  describe 'PUT#update' do

    it "has an ok status" do
      sign_in admin
      put :update, params: hobby.attributes, format: :json
      expect(response).to  have_http_status(:ok)
    end

    it "has an unauthorized status" do
      put :update, params: hobby.attributes, format: :json
      expect(response).to  have_http_status(:unauthorized)
    end
  end
end
