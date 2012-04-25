require 'nano_api'
require 'rails'

module NanoApi
  class Engine < Rails::Engine
    isolate_namespace NanoApi

    config.autoload_paths << root.join('lib')
  end
end
