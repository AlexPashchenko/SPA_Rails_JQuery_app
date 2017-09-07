class CountriesController < ApplicationController
  # include DeviseTokenAuth::Concerns::SetUserByToken
  before_action :set_country, only: [:show, :update, :destroy]
  before_action :authenticate_admin!, only:[:create, :update, :destroy]
  respond_to :json

  def index
    @countries = Country.all
    render json: @countries
  end


  def create
    @country = Country.new(country_params)
    if @country.save
      render json: @country, status: :created
    else
      render status: :unprocessable_entity
    end
  end

  def update
    if @country.update(country_params)
      render json: @country, status: :ok
    else
      render status: :unprocessable_entity
    end
  end

  def destroy
    @country.destroy
    head :no_content
  end

  private

    def set_country
      @country = Country.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def country_params
      params.permit(:id, :title)
    end
end
