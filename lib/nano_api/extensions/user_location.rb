module NanoApi
  module Extensions
    module UserLocation
      extend ActiveSupport::Concern

      included do
        helper_method :user_location
      end

    private

      def user_location
        @user_location ||= NanoApi::Client.geoip(request.remote_ip)
      end
    end
  end
end
