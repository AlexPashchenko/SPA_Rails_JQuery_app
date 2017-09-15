require 'rails_helper'
require 'rspec/rails'
require 'devise'
RSpec.describe UsersController, type: :controller do
  Devise::Test::ControllerHelpers

  let!(:user) { FactoryGirl.create :user }
  let!(:admin) { FactoryGirl.create :admin }
  let(:user_last) { User.last }

  context 'callbacks' do
    it { should use_before_action(:authenticate_admin!) }
    it { should use_before_action(:set_user) }
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

      it "render array of json objects user" do
        sign_in admin
        get :index, format: :json
        expect(assigns(:users)).to be_present
      end
    end

    context "#show" do

      it "has an unauthorized status" do
        get :show, params: { id: user.id }, format: :json
        expect(response).to  have_http_status(:unauthorized)
      end

      it "has a success status" do
        sign_in admin
        get :show, params: { id: user.id }, format: :json
        expect(response).to have_http_status(:success)
      end

      it "can't return user with invalid ID" do
        sign_in admin
        expect {
          get :show, params: { id: '100и000' }, format: :json
        }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it "render json object user" do
        sign_in admin
        get :show, params: { id: user.id }, format: :json
        expect(response.body).to eq(user.to_json)
      end
    end
  end

  describe 'POST#create' do

    it "has a unauthorized status" do
      post :create, params: FactoryGirl.attributes_for(:user), format: :json
      expect(response).to  have_http_status(:unauthorized)
    end

    it "has a created status" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:user), format: :json
      expect(response).to  have_http_status(:created)
    end

    it "can't create user without hobby" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:user, hobby_ids: []), format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't create user without country" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:user, country_id: ''), format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't create user with_invalid age" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:user, age: 'sdg'), format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't create user without age" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:user, age: ''), format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't create user without first_name" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:user, first_name: ''), format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't create user without last_name" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:user, last_name: ''), format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't create user without gender" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:user, gender: ''), format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't create user with not male/female gender" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:user, gender: 'undefound'), format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "render json object user" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:user), format: :json
      expect(response.body).to eq(user_last.to_json)
    end

    it "creates a new user" do
      sign_in admin
      expect {
        post :create, params: FactoryGirl.attributes_for(:user), format: :json
      }.to change(User,:count).by(1)
    end
  end

  describe 'PUT#update' do

    it "has an ok status" do
      sign_in admin
      put :update, params: {id: user.id, country_id: Country.first.id},
      format: :json
      expect(response).to  have_http_status(:ok)
    end

    it "has an unauthorized status" do
      put :update, params: user.attributes, format: :json
      expect(response).to  have_http_status(:unauthorized)
    end

    it "render updated json object user" do
      sign_in admin
      put :update, params: {id: user.id, country_id: Country.first.id },
      format: :json
      user.reload
      expect(user.country.title).to eq(Country.first.title)
    end

    it "can't update user with invalid age" do
      sign_in admin
      put :update, params: {id: user.id, age: 11000 }, format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't update user with invalid first_name" do
      sign_in admin
      put :update, params: {id: user.id, first_name: " " }, format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't update user with invalid last_name" do
      sign_in admin
      put :update, params: {id: user.id, last_name: " " }, format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't update user without hobby" do
      sign_in admin
      put :update, params: {id: user.id, hobby_ids:[""]}, format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't update user without country" do
      sign_in admin
      put :update, params: {id: user.id, country_id: ''}, format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't update user with  invalid ID" do
      sign_in admin
      expect {
        put :update, params: { id: '100и000' }, format: :json
      }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it "Doesn't a create new record in database" do
      sign_in admin
      expect {
        put :update, params: {id: user.id},
        format: :json
        user.reload
      }.to_not change(User,:count)
    end
  end

  describe 'DELETE#destroy' do

    it "has an unauthorized status" do
      delete :destroy, params: { id: user.id }, format: :json
      expect(response).to  have_http_status(:unauthorized)
    end

    it "has a no_content status" do
      sign_in admin
      delete :destroy, params: { id: user.id }, format: :json
      expect(response).to  have_http_status(:no_content)
    end

    it "can't delete user with invalid ID" do
      sign_in admin
      expect {
        delete :destroy, params: { id: '100и000' }, format: :json
      }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it "Delete one record from database" do
      expect {
        sign_in admin
        delete :destroy, params: { id: user.id }, format: :json
      }.to change(User,:count).by(-1)
    end
  end
end
