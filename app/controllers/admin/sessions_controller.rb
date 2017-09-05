class Admins::SessionsController < DeviseTokenAuth::SessionsController
  # before_action :configure_sign_in_params, only: [:create]
 include Devise::Controllers::InternalHelpers
  respond_to :json
  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  def create
    build_resource
       @admin = Admin.find_for_database_authentication(email: params[:email])
       return invalid_login_attempt unless @admin

       if @admin.valid_password?(params[:password])
         sign_in(@admin)
         render :json=> success:true, auth_token: @admin.token, email: @admin.email }
          head:@admin.token
       end
       head:@admin.token
   end

  # DELETE /resource/sign_out
  def destroy
    sign_out(@admin)
  end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
