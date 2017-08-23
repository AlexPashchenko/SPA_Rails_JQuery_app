class AdminsController < ApplicationController
  before_action :authenticate_admin!, except:[:index, :show]
  before_action :set_admin, except:[:index, :create]

  def index
    @admins = Admin.all
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
    if @admin.update(admin_params)
      render json: @admin, status: :ok
    else
      render status: :unprocessable_entity
    end
  end

  def destroy
    @admin.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end


  private

    def set_admin
      @admin = Admin.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_params
      params.require(:admin).permit(:email, :password)
    end
end