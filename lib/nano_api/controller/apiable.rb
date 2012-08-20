module NanoApi
  module Controller
    module Apiable
      extend ActiveSupport::Concern

      included do
        before_filter :initialize_api_instance
      end

      private

      def initialize_api_instance
        NanoApi.client = NanoApi::Client.new(self)
      end
    end
  end
end
