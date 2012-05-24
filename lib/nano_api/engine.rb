require 'nano_api'
require 'rails'

module NanoApi
  class Engine < Rails::Engine
    isolate_namespace NanoApi

    config.autoload_paths << root.join('lib')

    config.after_initialize do
      Rails.application.config.action_dispatch.rescue_responses.merge!(
        "RestClient::ResourceNotFound" => :not_found
      )
    end
  end
end
