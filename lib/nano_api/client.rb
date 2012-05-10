require 'rest_client'
require 'active_support/core_ext/hash'
require 'json'
require 'digest/md5'

module NanoApi
  module Client
    AFFILIATE_MARKER_PATTERN = /\A\d{5}/

    class << self
      include Client::Search
      include Client::Click
      include Client::Places
      include Client::MinimalPrices
      include Client::Airlines

      def affiliate_marker? marker
        !!(marker.to_s =~ AFFILIATE_MARKER_PATTERN)
      end

      protected

      def get *args
        request :get, *args
      end

      def post *args
        request :post, *args
      end

      def get_json path, params = {}, options = {}
        get(path, params, options.merge(parse_json: false))
      end

      def post_json path, params = {}, options = {}
        post(path, params, options.merge(parse_json: false))
      end

      def request method, path, params = {}, options = {}
        options[:parse_json] = true unless options.key?(:parse_json)

        params = params.reverse_merge(locale: I18n.locale)
        path += '.json'

        if method == :get
          path = [path, params.to_query].delete_if(&:blank?).join('?')
          params = {}
        end

        response = site[path].send(method, params)
        options[:parse_json] ? JSON.parse(response) : response
      end

      def site
        @site ||= RestClient::Resource.new(NanoApi.search_server)
      end
    end
  end
end
