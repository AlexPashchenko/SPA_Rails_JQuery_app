class AdminsController < ApplicationController
  before_action :authenticate_admin!, only:[:create, :update, :destroy]
  before_action :get_admin, except:[:index, :create]

  def index
    @admins = Admin.all
    render json: @admins
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
    if @admin.destroy
      head :no_content
    else
      render status: :unprocessable_entity
    end
  end


  private

    def get_admin
      @admin = Admin.find(params[:id])
    end


    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_params
      params.permit(:id, :email, :password, :current_password, :password_confirmation, :tokens)
    end
end
