class HobbyController < ApplicationController

  # def create
  #   @hobby = Hobby.new(hobby_params)
  #
  #   respond_to do |format|
  #     if @hobby.save
  #       format.html { redirect_to @hobby, notice: 'User was successfully created.'}
  #       # format.json { render :show, status: :created, location: @hobby }
  #     else
  #       format.html { render :new }
  #       format.json { render json: @hobby.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end
  #
  # private
  #   # Use callbacks to share common setup or constraints between actions.
  #   def set_hobby
  #     @hobby = Hobby.find(params[:id])
  #   end
  #
  #   # Never trust parameters from the scary internet, only allow the white list through.
  #   def hobby_params
  #     params.require(:hobby).permit(:title)
  #   end
end
