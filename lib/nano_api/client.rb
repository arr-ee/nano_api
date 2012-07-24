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

      def current_request= request
        Thread.current[:current_request] = request
      end

      def current_request
        Thread.current[:current_request]
      end

      protected

      def get *args
        request :get, *args
      end

      def post *args
        request :post, *args
      end

      def get_raw path, params = {}, options = {}
        get path, params, options.merge(parse: false)
      end

      def post_raw path, params = {}, options = {}
        post path, params, options.merge(parse: false)
      end

      def request method, path, params = {}, options = {}
        options.reverse_merge!(parse: true)
        params.reverse_merge!(locale: I18n.locale)
        path += '.json'

        headers = {}
        headers = {:accept_language => current_request.env['HTTP_ACCEPT_LANGUAGE']} if current_request

        response = if method == :get
          path = [path, params.to_query].delete_if(&:blank?).join('?')
          site[path].send(method, headers)
        else
          site[path].send(method, params, headers)
        end
        options[:parse] ? JSON.parse(response) : response
      end

      def site
        @site ||= RestClient::Resource.new(NanoApi.search_server)
      end
    end
  end
end
