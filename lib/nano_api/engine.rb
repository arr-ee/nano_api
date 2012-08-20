require 'nano_api'
require 'nano_api/controller'
require 'rails'

module NanoApi
  class Engine < Rails::Engine
    isolate_namespace NanoApi

    config.autoload_paths << root.join('lib')

    config.action_dispatch.rescue_responses.merge!(
      "RestClient::ResourceNotFound" => :not_found
    )

    ActiveSupport.on_load :action_controller do
      ActionController::Base.send :include, NanoApi::Controller
    end
  end
end
