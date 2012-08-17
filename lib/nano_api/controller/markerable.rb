module NanoApi
  module Controller
    module Markerable
      extend ActiveSupport::Concern

      included do
        helper_method :marker
        prepend_before_filter :handle_marker
      end

      def marker
        @marker ||= cookies[:marker]
      end

    private

      def handle_marker
        marker = params[:marker].presence || params[:ref].presence

        if marker && _new_marker?(marker) && (_affiliate_marker?(marker) || !_affiliate_marker?(cookies[:marker]))
          cookies[:marker] = {
            :value => marker,
            :domain => request.domain,
            :expires => 30.days.from_now
          }
        end
      end

      def _new_marker?(marker)
        marker.present? && marker != cookies[:marker]
      end

      def _affiliate_marker?(marker)
        NanoApi::Client.affiliate_marker?(marker)
      end
    end
  end
end
