module NanoApi
  module Client
    module Places
      def auto_complete_place temp, locale = I18n.locale
        get_json('places_%s' % locale, temp: temp)
      rescue RestClient::BadRequest
        nil
      end

      def geoip ip, locale = I18n.locale
        get('places/ip_to_places_%s' % locale, ip: ip).first.try(:symbolize_keys)
      end
    end
  end
end