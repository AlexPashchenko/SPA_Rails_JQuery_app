require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module SPARailsJqueryApp
  class Application < Rails::Application
    # config.active_record.raise_in_transactional_callbacks = true
    #
    # config.middleware.use config.session_store, config.session_options
    # config.middleware.use Rack::MethodOverride
    # config.middleware.use ActionDispatch::Cookies
    # config.middleware.use ActionDispatch::Session::CookieStore
    # config.middleware.use ActionDispatch::Flash

  end
end
