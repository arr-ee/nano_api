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

      def request method, path, params = {}, options = {}
        options[:parse_json] = true unless options.key?(:parse_json)
        response = site[path].send(method, params)
        options[:parse_json] ? JSON.parse(response) : response
      end

      def site
        @site ||= RestClient::Resource.new(NanoApi.search_server)
      end
    end
  end
end
