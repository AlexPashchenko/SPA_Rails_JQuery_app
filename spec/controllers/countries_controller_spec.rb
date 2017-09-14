require 'rails_helper'
require 'rspec/rails'
require 'devise'

RSpec.describe CountriesController, type: :controller do
  Devise::Test::ControllerHelpers

  let!(:country) { FactoryGirl.create :country }
  let(:country_last) { Country.last }
  let(:admin) { FactoryGirl.create :admin }

  context 'callbacks' do
    it { should use_before_action(:authenticate_admin!) }
    it { should use_before_action(:set_country) }
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

      it "render array of json objects country" do
        sign_in admin
        get :index, format: :json
        expect(assigns(:countries)).to exist(country_last.id)
      end
    end

    context "#show" do

      it "has an unauthorized status" do
        get :show, params: { id: country.id }, format: :json
        expect(response).to  have_http_status(:unauthorized)
      end

      it "has a success status" do
        sign_in admin
        get :show, params: { id: country.id }, format: :json
        expect(response).to have_http_status(:success)
      end

      it "render json object country" do
        sign_in admin
        get :show, params: { id: country_last.id }, format: :json
        expect(response.body).to eq(country_last.to_json)
      end
    end
  end

  describe 'POST#create' do

    it "has a unauthorized status" do
      post :create, params: FactoryGirl.attributes_for(:country), format: :json
      expect(response).to  have_http_status(:unauthorized)
    end

    it "has a created status" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:country), format: :json
      expect(response).to  have_http_status(:created)
    end

    it "render json object country" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:country), format: :json
      expect(response.body).to eq(country_last.to_json)
    end

    it "creates a new country" do
      sign_in admin
      expect {
        post :create, params: FactoryGirl.attributes_for(:country), format: :json
      }.to change(Country,:count).by(1)
    end
  end

  describe 'PUT#update' do

    it "has an ok status" do
      sign_in admin
      put :update, params: country_last.attributes, format: :json
      expect(response).to  have_http_status(:ok)
    end

    it "has an unauthorized status" do
      put :update, params: country.attributes, format: :json
      expect(response).to  have_http_status(:unauthorized)
    end

    it "render json object hobby" do
      sign_in admin
      put :update, params: {id: country.id, title: "new title"}, format: :json
      country.reload
      expect(country.title).to eq('new title')
    end

    it "Doesn't a create new record in database" do
      sign_in admin
      expect {
        put :update, params: {id: country.id, title: "sdgd"}, format: :json
        country.reload
      }.to_not change(Country,:count)
    end
  end

  describe 'DELETE#destroy' do

    it "has an unauthorized status" do
      delete :destroy, params: { id: country.id }, format: :json
      expect(response).to  have_http_status(:unauthorized)
    end

    it "has a no_content status" do
      sign_in admin
      delete :destroy, params: { id: country.id }, format: :json
      expect(response).to  have_http_status(:no_content)
    end

    it "Delete one record from database" do
      expect {
        sign_in admin
        delete :destroy, params: { id: country.id }, format: :json
      }.to change(Country,:count).by(-1)
    end
  end
end
