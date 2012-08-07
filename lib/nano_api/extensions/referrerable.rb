module NanoApi
  module Extensions
    module Referrerable
      extend ActiveSupport::Concern

      included do
        before_filter :handle_referrer
      end

    private

      def handle_referrer
        referrer_domain = extract_domain(request.referrer)
        if referrer_domain && referrer_domain != request.domain
          session[:referrer] = request.referrer
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
