require 'rails_helper'
require 'rspec/rails'
require 'devise'
RSpec.describe AdminsController, type: :controller do
  Devise::Test::ControllerHelpers

  let!(:admin) { FactoryGirl.create :admin }
  let!(:admin2) { FactoryGirl.create :admin }
  let(:admin_last) { Admin.last }

  context 'callbacks' do
    it { should use_before_action(:authenticate_admin!) }
    it { should use_before_action(:get_admin) }
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

      it "render array of json objects admin" do
        sign_in admin
        get :index, format: :json
        expect(assigns(:admins)).to exist(admin.id)
      end
    end

    context "#show" do

      it "has an unauthorized status" do
        get :show, params: { id: admin.id }, format: :json
        expect(response).to  have_http_status(:unauthorized)
      end

      it "has a success status" do
        sign_in admin
        get :show, params: { id: admin.id }, format: :json
        expect(response).to have_http_status(:success)
      end

      it "can't return object with invalid ID" do
        sign_in admin
        expect {
          get :show, params: { id: '100и000' }, format: :json
        }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it "render json object admin" do
        sign_in admin
        get :show, params: { id: admin.id }, format: :json
        expect(response.body).to eq(admin.to_json)
      end
    end
  end

  describe 'POST#create' do

    it "has a unauthorized status" do
      post :create, params: FactoryGirl.attributes_for(:admin), format: :json
      expect(response).to  have_http_status(:unauthorized)
    end

    it "can't create account with already existed email" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:admin, email: admin_last.email), format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't create account with invalid email" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:admin, email: "invalid@email"), format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't create account with invalid password_confirmation" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:admin, password_confirmation: "invalid" ), format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't create account with invalid password" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:admin, password: "12345" ), format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "has a created status" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:admin), format: :json
      expect(response).to  have_http_status(:created)
    end

    it "render json object admin" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:admin), format: :json
      expect(response.body).to eq(admin_last.to_json)
    end

    it "creates a new admin" do
      sign_in admin
      expect {
        post :create, params: FactoryGirl.attributes_for(:admin), format: :json
      }.to change(Admin,:count).by(1)
    end
  end

  describe 'PUT#update' do

    it "has an ok status" do
      sign_in admin
      put :update, params: {id: admin.id, email: "newemail@gmail.com", password: "password", current_password: admin.password, password_confirmation:  "password" },
      format: :json
      expect(response).to  have_http_status(:ok)
    end

    it "has an unauthorized status" do
      put :update, params: admin.attributes, format: :json
      expect(response).to  have_http_status(:unauthorized)
    end

    it "render updated json object admin" do
      sign_in admin
      put :update, params: {id: admin.id, email: "newemail@gmail.com", password: "password", current_password: admin.password, password_confirmation:  "password" },
      format: :json
      admin.reload
      expect(admin.email).to eq('newemail@gmail.com')
    end

    it "can't update account email with already existed email" do
      sign_in admin
      put :update, params: {id: admin.id, email: admin2.email  }, format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't update account password with invalid confirmation" do
      sign_in admin
      put :update, params: {id: admin.id, password: "new_password", password_confirmation:"not_current_confirmation", current_password: admin.password }, format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't update account without correct current_password" do
      sign_in admin
      put :update, params: {id: admin_last.id, current_password: "not_current_password" }, format: :json
      expect(response).to  have_http_status(:unprocessable_entity)
    end

    it "can't update object with invalid ID" do
      sign_in admin
      expect {
        put :update,  params: { id: '100и000' }, format: :json
      }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it "Doesn't a create new record in database" do
      sign_in admin
      expect {
        put :update, params: {id: admin.id, email: "newemail@gmail.com", password: "password", current_password: admin.password, password_confirmation:  "password" },
        format: :json
        admin.reload
      }.to_not change(Admin,:count)
    end
  end

  describe 'DELETE#destroy' do

    it "has an unauthorized status" do
      delete :destroy, params: { id: admin2.id }, format: :json
      expect(response).to  have_http_status(:unauthorized)
    end

    it "has a no_content status" do
      sign_in admin
      delete :destroy, params: { id: admin2.id }, format: :json
      expect(response).to  have_http_status(:no_content)
    end

    it "can't delete object with invalid ID" do
      sign_in admin
      expect {
        delete :destroy,  params: { id: '100и000' }, format: :json
      }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it "can't delete own account" do
      sign_in admin
      delete :destroy, params: { id: admin.id }, format: :json
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "Delete one record from database" do
      expect {
        sign_in admin
        delete :destroy, params: { id: admin2.id }, format: :json
      }.to change(Admin,:count).by(-1)
    end
  end
end
