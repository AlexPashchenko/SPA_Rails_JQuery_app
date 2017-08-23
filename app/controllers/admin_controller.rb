class AdminController < ApplicationController
  before_action :authenticate_admin!

  def destroy
    @admins = Admin.all
    unless @admins.count == 1
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
      params.require(:admin).permit(:email, :encrypted_password)
    end
end