module NanoApi
  module Client
    module Places
      def auto_complete_place temp
        get('places_ru.json', {temp: temp}, parse_json: false)
      rescue RestClient::BadRequest
        nil
      end

      def geoip ip, locale = I18n.locale
        get('places/ip_to_places_%s.json' % locale, ip: ip).first.try(:symbolize_keys)
      end
    end
  end
end
