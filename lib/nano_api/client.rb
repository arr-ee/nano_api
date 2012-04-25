require 'rest_client'
require 'active_support/core_ext/hash'
require 'json'
require 'digest/md5'

module NanoApi
  class Client
    SITE = 'http://localhost:3000'
    AFFILIATE_MARKER_PATTERN = /\A\d{5}/
    class << self
      SEARCH_PARAMS_KEYS = %w[
        origin_iata origin_name destination_iata destination_name
        depart_date return_date
        adults children infants
        trip_class range
      ].map(&:to_sym)

      def search host, params
        marker = api_client_marker(params[:marker])
        search_params = params.slice(*SEARCH_PARAMS_KEYS)
        site['searches.json'].post(
          search: {
            host: host,
            marker: marker,
            params_attributes: search_params
          },
          signature: api_client_signature(marker, search_params),
          enable_api_auth: true
        )
      rescue RestClient::BadRequest, RestClient::Forbidden => exception
        [exception.http_body, exception.http_code]
      rescue RestClient::InternalServerError
        nil
      end

      def search_duration
        JSON.parse(site['estimated_search_duration.json'].get)['estimated_search_duration'].to_i
      end

      def click search_id, order_url_id
        JSON.parse(
          site['searches/%d/order_urls/%d.json' % [search_id, order_url_id]].post({})
        ).symbolize_keys
      rescue RestClient::ResourceNotFound
        nil
      end

      def auto_complete_places temp
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

      def affilate_marker? marker
        !!(marker.to_s =~ AFFILIATE_MARKER_PATTERN)
      end

      protected

      def site
        @site ||= RestClient::Resource.new(NanoApi.search_server)
      end

      def api_client_signature marker, params
        Digest::MD5.hexdigest(
          [NanoApi.api_token, marker, *params.values_at(*params.keys.sort)].join(?:)
        )
      end

      def api_client_marker additional_marker
        result = [additional_marker]
        result.unshift(NanoApi.marker) if NanoApi.marker.present?
        result.compact.join(?.)
      end
    end
  end
end
