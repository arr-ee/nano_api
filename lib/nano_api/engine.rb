require 'nano_api'
require 'rails'

module NanoApi
  class Engine < Rails::Engine
    isolate_namespace NanoApi
  end
end
