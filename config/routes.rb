Rails.application.routes.draw do

  devise_for :admins, controllers: {
    sessions: 'admins/sessions'
    # registrations: "admins/registrations"
  }
  get '/index', :to => redirect('/index.html')
# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :countries, except: [:edit, :new]
  resources :users, except: [:edit, :new]
  resources :hobbies, except: [:edit, :new]
  resources :admins, except: [:edit, :new]
end
