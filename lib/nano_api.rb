require 'rest_client'
require 'nano_api/version'
require 'nano_api/engine' if defined? Rails
require 'nano_api/global'

RestClient.log = Rails.logger if defined? Rails

module NanoApi
  extend NanoApi::Global

  module Backends
    extend ActiveSupport::Autoload

    autoload_under 'controllers' do
      autoload :SearchesController
      autoload :ClicksController
    end
  end
end
