class HobbiesController < ApplicationController
  before_action :authenticate_admin!, only: [:create, :update, :destroy]
  before_action :set_user, only: [:show, :update, :destroy]
  respond_to :json

  def index
    @hobbies = Hobby.all
    render json: @hobbies
  end

  def show
    render json: @hobby
  end

  def create
    @hobby = Hobby.new(hobby_params)

    if @hobby.save
     render json: @hobby, status: :created
    else
     render status: :unprocessable_entity
    end
  end

  def update
    if @hobby.update(hobby_paramss)
      render json: @hobby, status: :ok
    else
      render status: :unprocessable_entity
    end
  end

  def destroy
    @hobby.destroy
    head :no_content
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_hobby
      @hobby = Hobby.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def hobby_params
      params.require(:hobby).permit(:title)
    end
end
