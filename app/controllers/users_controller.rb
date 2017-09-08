class UsersController < ApplicationController
  before_action :authenticate_admin!, except:[:index]
  before_action :set_user, only: [:show , :update, :destroy]
  respond_to :json

  def index
    @users = User.joins(:country).order(:id).collect { |user| user.country.attributes.merge(user.attributes).merge({hobbies_attributes: user.user_hobbies}) }
    render json: @users
  end

  def show
    render json: @user
  end

  # POST /users
  # POST /users.json

  def create
    @user = User.new(user_params)
    # byebug
    if @user.save
      render json: @user, status: :created
    else
      render status: :unprocessable_entity
    end
  end

  def update_order
      @users = User.all
      @users.save
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    if @user.update(user_params)
      render json: @user, status: :ok
    else
      render status: :unprocessable_entity
    end
  end


  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.permit(:id, :first_name, :last_name, :age, :gender, :country_id, hobby_ids:[])
    end
end
