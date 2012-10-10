module NanoApi
  module Controller
    module Locatable
      extend ActiveSupport::Concern

      included do
        helper_method :user_location, :user_location_attributes
      end

      private

      def user_location
        unless request.local? || request.remote_ip =~ /^(172\.(1[7-9]|2\d|3[01])\.|10\.|192\.168\.)/ # Private IP addresses
          session[:user_location] ||= NanoApi.client.geoip(request.remote_ip) rescue nil
        end
        session[:user_location]
      end

      def user_location_attributes
        if user_location.is_a?(Hash)
          { :origin_name => user_location[:name], :origin_iata => user_location[:iata] }
        else
          {}
        end
      end
    end
  end
end
