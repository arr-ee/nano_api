module NanoApi
  module Extensions
    module Markerable
      extend ActiveSupport::Concern

      included do
        helper_method :marker
      end

    private

      def handle_marker
        marker = params[:search].try(:[], :marker) || params[:marker] || params[:ref]

        if _new_marker?(marker) && (_from_affiliate?(marker) || _current_non_affiliate?)
          cookies[:marker] = {
            :value => marker,
            :domain => request.domain,
            :expires => 30.days.from_now
          }
        end
      end

      def marker
        @marker ||= cookies[:marker]
      end

      def _new_marker?(marker)
        marker.present? && marker != cookies[:marker]
      end

      def _from_affiliate?(marker)
        NanoApi::Client.affiliate_marker?(marker)
      end

      def _current_non_affiliate?
        !NanoApi::Client.affiliate_marker?(cookies[:marker])
      end
    end
  end
end
