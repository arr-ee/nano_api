module NanoApi
  module Extensions
    module Referrerable
      extend ActiveSupport::Concern

      included do
        before_filter :handle_referer
      end

    private

      def handle_referer
        referer_domain = extract_domain(request.referer)
        if referer_domain && referer_domain != request.domain
          session[:referer] = request.referer
          session[:landing_page] = request.url
        end
      end

      def extract_domain uri, tld_length = 1
        uri = URI.parse uri.to_s unless uri.is_a? URI
        ActionDispatch::Http::URL.extract_domain(uri.host).presence
      end
    end
  end
end
