module NanoApi
  module Extensions
    module UserLocation
      extend ActiveSupport::Concern

      included do
        helper_method :user_location, :user_location_attributes
      end

      private

      def user_location
        session[:user_location] ||= NanoApi::Client.geoip(request.remote_ip) rescue nil
      end

      def user_location_attributes
        if user_location.is_a?(Hash)
          {
            :origin_name => user_location[:name],
            :origin_iata => user_location[:iata]
          }
        else
          {}
        end
      end
    end
  end
end
