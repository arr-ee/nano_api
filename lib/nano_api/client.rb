require 'active_support/core_ext/hash'
require 'json'
require 'digest/md5'

module NanoApi
  class Client
    AFFILIATE_MARKER_PATTERN = /\A\d{5}/
    MAPPING = {:'zh-CN' => :cn}

    include NanoApi::Client::Search
    include NanoApi::Client::Click
    include NanoApi::Client::Places
    include NanoApi::Client::MinimalPrices
    include NanoApi::Client::Airlines
    include NanoApi::Client::UiEvents
    include NanoApi::Client::Overmind

    attr_reader :controller
    delegate :request, :session, to: :controller, allow_nil: true
    delegate :site, :signature, to: 'self.class'

    def initialize controller = nil
      @controller = controller
    end

    def self.site
      @site ||= RestClient::Resource.new(NanoApi.config.search_server)
    end

    def self.affiliate_marker? marker
      !!(marker.to_s =~ AFFILIATE_MARKER_PATTERN)
    end

    def self.signature marker, *params
      Digest::MD5.hexdigest([
        NanoApi.config.api_token,
        marker,
        *Array.wrap(params).flatten
      ].join(?:))
    end

  protected

    def get *args
      perform :get, *args
    end

    def post *args
      perform :post, *args
    end

    def get_raw path, params = {}, options = {}
      get path, params, options.merge(parse: false)
    end

    def post_raw path, params = {}, options = {}
      post path, params, options.merge(parse: false)
    end

    def perform method, path, params = {}, options = {}
      options.reverse_merge!(parse: true)
      params.reverse_merge!(locale: MAPPING[I18n.locale] || I18n.locale)
      path += '.json'

      headers = {}
      if request
        params.reverse_merge!(user_ip: request.remote_ip) if request.remote_ip.present?
        headers[:accept_language] = request.env['HTTP_ACCEPT_LANGUAGE']
        headers[:referer] = request.session[:referer] if request.session[:referer]
        headers[:landing_page] = request.session[:landing_page] if request.session[:landing_page]
      end

      params[:signature] = signature(params[:marker], options[:signature]) if options[:signature]

      response = if method == :get
        path = [path, params.to_query].delete_if(&:blank?).join('?')
        site[path].send(method, headers)
      else
        site[path].send(method, params, headers)
      end
      options[:parse] ? JSON.parse(response) : response
    end

  end
end
