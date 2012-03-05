require 'rest_client'
require 'active_support/core_ext/hash'
require 'json'

module NanoApi
  class Client
    
    SITE = 'http://nano.local:3001'
    
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
          site["searches/#{search_id}/order_urls/#{order_url_id}.json"].get({})
        ).symbolize_keys
      rescue RestClient::ResourceNotFound
        nil
      end

      def auto_complete_place temp
        site['places_ru.json'].get(temp: temp)
      rescue RestClient::BadRequest
        nil
      end

      def week_minimal_prices search_id, direct_date = nil, return_date = nil
        site['minimal_prices.json'].get(search_id: search_id, direct_date: direct_date, return_date: return_date)
      end

      def month_minimal_prices search_id, month = nil
        site['month_minimal_prices.json'].get(search_id: search_id, month: month)
      end

      protected

      def site
        @site ||= RestClient::Resource.new(SITE)
      end
    end
  end
end
