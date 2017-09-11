class AdminsController < ApplicationController
  before_action :authenticate_admin!, only:[:create, :update, :destroy]
  before_action :get_admin, only: [:show , :update, :destroy]

  def index
    @admins = Admin.all.order(:id)
    render json: @admins
  end

  def show
    render json: @admin
  end

  def create
    @admin = Admin.new(admin_params)
    if @admin.save
      render json: @admin, status: :created
    else
      render status: :unprocessable_entity
    end
  end

  def update
    enc = Devise.token_generator.generate(Admin, :reset_password_token)
    @admin.reset_password_token = enc
    if @admin.update_with_password(admin_params)
      render json: @admin, status: :ok
    else
      render status: :unprocessable_entity
    end
  end

  def destroy
    if @admin != @current_admin && @admin.destroy
      head :no_content
    else
      render status: :unprocessable_entity, message: "Can't delete this admin"
    end
  end


  private

    def get_admin
      @admin = Admin.find(params[:id])
    end

    def admin_params
      params.permit(:id, :email, :password, :current_password, :password_confirmation, :tokens)
    end
end
