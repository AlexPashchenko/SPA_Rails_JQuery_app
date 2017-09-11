class UsersController < ApplicationController
  before_action :authenticate_admin!, except:[:index]
  before_action :set_user, only: [:show , :update, :destroy]
  respond_to :json

  def index
    @users = User.joins(:country).order(order_num: :desc).collect { |user| user.country.attributes.merge(user.attributes).merge({hobbies_attributes: user.user_hobbies}) }
    render json: @users
  end

  def show
    render json: @user
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user, status: :created
    else
      render status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: @user, status: :ok
    else
      render status: :unprocessable_entity
    end
  end

  def sorting
    @users = User.all
    if @users.update(sort_params)
      render json: @users, status: :ok
    else
      render status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
    head :no_content
  end


  private

    def set_user
      @user = User.find(params[:id])
    end

    def sort_params
      params.permit(:id, :order_num)
    end

    def user_params
      params.permit(:id, :first_name, :last_name, :age, :gender, :country_id, :order_num, hobby_ids:[])
    end
end
