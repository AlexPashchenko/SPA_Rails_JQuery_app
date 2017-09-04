class Admins::SessionsController < Devise::SessionsController
# before_action :configure_sign_in_params, only: [:create]
    respond_to :json
  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  def create
    resource = Admin.find_for_database_authentication(email: params[:email])
    return invalid_login_attempt unless resource

    if resource.valid_password?(params[:password])
      sign_in :admin, resource
      render nothing: true
    end
    # invalid_login_attempt
   end
  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  protected


  def invalid_login_attempt
    set_flash_message(:alert, :invalid)
    render json: flash[:alert], status: 401
  end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
