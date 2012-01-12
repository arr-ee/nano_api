require 'rest_client'
require 'active_support/core_ext/hash'
require 'json'

module NanoApi
  class Client
    SITE = 'http://nano.local'
    
    class << self
      def search additional_marker = nil, params
        marker = [additional_marker].compact.join('.')
        
        site['searches.json'].post(search: {marker: marker, params_attributes: params})
      rescue RestClient::BadRequest, RestClient::Forbidden => exception
        exception.http_body
      rescue RestClient::InternalServerError
        nil
      end

      def click search_id, order_url_id
        JSON.parse(
          site["searches/#{search_id}/order_urls/#{order_url_id}.json"].get
        ).symbolize_keys
      rescue RestClient::NotFound
        nil
      end

      def auto_complete_place temp
        site['places_ru.json'].get(temp: temp)
      rescue RestClient::BadRequest
        nil
      end

      protected

      def site
        @site ||= RestClient::Resource.new(SITE)
      end
    end
  end
end
