Rails.application.routes.draw do

  mount_devise_token_auth_for 'Admin', at: 'auth',
  skip:[:passwords, :omniauth_callbacks],
  defaults: { format: :json }

  get '/index', :to => redirect('/index.html')

# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :countries, except: [:edit, :new]
  resources :users, except: [:edit, :new]
  resources :hobbies, except: [:edit, :new]
  resources :admins, except: [:edit, :new]
end
