class CountryController < ApplicationController

  # def create
  #   @country = Country.new(country_params)
  #
  #   respond_to do |format|
  #     if @country.save
  #       format.html { redirect_to @country, notice: 'User was successfully created.'}
  #       format.json { render :show, status: :created, location: @country }
  #     else
  #       format.html { render :new }
  #       format.json { render json: @country.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end
  #
  # def set_country
  #   @country = Country.find(params[:id])
  # end
  #
  # # Never trust parameters from the scary internet, only allow the white list through.
  # def country_params
  #   params.require(:country).permit(:title)
  # end
end
