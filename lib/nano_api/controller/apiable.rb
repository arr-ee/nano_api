module NanoApi
  module Controller
    module Apiable
      extend ActiveSupport::Concern

      included do
        include NanoApi::Controller::Locatable

        before_filter :initialize_api_instance
      end

    private

      def initialize_api_instance
        NanoApi.client = NanoApi::Client.new(self)
      end

      def search_instance attributes = {}
        search = NanoApi::Search.new(user_location_attributes)
        search.update_attributes(cookie_params)
        search.update_attributes(attributes)
        search
      end

      def cookie_params
        JSON.parse(cookies[:search_params1].presence)['params_attributes'].slice(
          'origin', 'destination'
        ) rescue {}
      end

    end
  end
end
