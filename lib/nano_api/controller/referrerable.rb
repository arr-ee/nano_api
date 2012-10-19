module NanoApi
  module Controller
    module Referrerable
      extend ActiveSupport::Concern

      included do
        before_filter :handle_referer
      end

    private

      def handle_referer
        referer_domain = _extract_domain(request.referer)
        if referer_domain && referer_domain != request.domain
          session[:current_referer] ||= {}
          session[:current_referer][:search_count] = 0 if session[:current_referer][:referer] != request.referer
          session[:current_referer][:referer] = request.referer
          session[:current_referer][:landing_page] = request.url
        end
      end

      def increase_referer_search_count!
        session[:current_referer][:search_count] += 1 if session[:current_referer]
      end

      def _extract_domain uri, tld_length = 1
        uri = URI.parse uri.to_s unless uri.is_a? URI
        ActionDispatch::Http::URL.extract_domain(uri.host, tld_length).presence
      end
    end
  end
end
