require 'rails_helper'
require 'rspec/rails'
require 'devise'

RSpec.describe HobbiesController, type: :controller do
  Devise::Test::ControllerHelpers

  let!(:hobby) { FactoryGirl.create :hobby }
  let(:updated_hobby) { FactoryGirl.build :hobby }
  let(:hobby_last) { Hobby.last }
  let(:admin) { FactoryGirl.create :admin }
  undef_id = Hobby.last.id + 1

  context 'callbacks' do
    it { should use_before_action(:authenticate_admin!) }
    it { should use_before_action(:set_hobby) }
  end

  describe 'GET' do

    context '#index' do

      it "has an unauthorized status" do
        get :index, format: :json
        expect(response).to have_http_status(:unauthorized)
      end

      it "has a success status" do
        sign_in admin
        get :index, format: :json
        expect(response).to have_http_status(:success)
      end

      it "render array of json objects hobby" do
        sign_in admin
        get :index, format: :json
        expect(assigns(:hobbies)).to exist(hobby_last.id)
      end
    end

    context '#show' do

      it "has an unauthorized status" do
        get :show, params: { id: hobby.id }, format: :json
        expect(response).to have_http_status(:unauthorized)
      end

      it "has a success status" do
        sign_in admin
        get :show, params: { id: hobby.id }, format: :json
        expect(response).to have_http_status(:success)
      end

      it "render json object hobby" do
        sign_in admin
        get :show, params: { id: hobby_last.id }, format: :json
        expect(response.body).to eq(hobby_last.to_json)
      end

      it "can't return object with invalid ID" do
        sign_in admin
        expect {
          get :show, params: { id: undef_id }, format: :json
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'POST#create' do

    it "has a unauthorized status" do
      post :create, params: FactoryGirl.attributes_for(:hobby), format: :json
      expect(response).to have_http_status(:unauthorized)
    end

    it "has a created status" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:hobby), format: :json
      expect(response).to have_http_status(:created)
    end

    it "render json object hobby" do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:hobby), format: :json
      expect(response.body).to eq(hobby_last.to_json)
    end

    it "can't create hobby without title " do
      sign_in admin
      post :create, params: FactoryGirl.attributes_for(:hobby, title: " "), format: :json
      expect(response).to have_http_status(:unprocessable_entity)
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
      put :update, params: hobby_last.attributes, format: :json
      expect(response).to have_http_status(:ok)
    end

    it "has an unauthorized status" do
      put :update, params: hobby_last.attributes, format: :json
      expect(response).to have_http_status(:unauthorized)
    end

    it "render json object hobby" do
      sign_in admin
      put :update, params: { id: hobby_last.id, title: updated_hobby.title }, format: :json
      hobby_last.reload
      expect(hobby_last.title).to eq(updated_hobby.title)
    end

    it "can't update hobby with blanck title" do
      sign_in admin
      put :update, params: { id: hobby.id, title: " " }, format: :json
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "can't update object with invalid ID" do
      sign_in admin
      expect {
        put :update, params: { id: undef_id }, format: :json
      }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it "Doesn't a create new record in database" do
      sign_in admin
      expect {
        put :update, params: { id: hobby_last.id, title: updated_hobby.title }, format: :json
        hobby_last.reload
      }.to_not change(Hobby,:count)
    end
  end

  describe 'DELETE#destroy' do

    it "has an unauthorized status" do
      delete :destroy, params: { id: hobby_last.id }, format: :json
      expect(response).to have_http_status(:unauthorized)
    end

    it "has a no_content status" do
      sign_in admin
      delete :destroy, params: { id: hobby_last.id }, format: :json
      expect(response).to have_http_status(:no_content)
    end

    it "can't delete object with invalid ID" do
      sign_in admin
      expect {
        delete :destroy, params: { id: undef_id }, format: :json
      }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it "Delete one record from database" do
      expect {
        sign_in admin
        delete :destroy, params: { id: hobby_last.id }, format: :json
      }.to change(Hobby,:count).by(-1)
    end
  end
end
