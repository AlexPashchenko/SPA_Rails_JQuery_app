class HobbiesController < ApplicationController
  before_action :authenticate_admin!
  before_action :set_hobby, only: [:show , :update, :destroy]
  respond_to :json

  def index
    @hobbies = Hobby.order(:id)
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
      head :unprocessable_entity
    end
  end

  def update
    if @hobby.update(hobby_params)
      render json: @hobby, status: :ok
    else
      head :unprocessable_entity
    end
  end

  def destroy
    @hobby.destroy
    head :no_content
  end

  private

    def set_hobby
      @hobby = Hobby.find(params[:id])
    end

    def hobby_params
      params.permit(:title)
    end
end
