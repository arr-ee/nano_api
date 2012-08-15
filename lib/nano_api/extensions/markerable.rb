module NanoApi
  module Extensions
    module Markerable
      extend ActiveSupport::Concern

      included do
        helper_method :marker
      end

    private

      def handle_marker
        params[:search][:marker] ||= params[:ref]
        if _new_marker? && (_from_affiliate? || _current_non_affiliate?)
          cookies[:marker] = {
            :value => params[:search][:marker],
            :domain => request.domain,
            :expires => 30.days.from_now
          }
        end
      end

      def marker
        @marker ||= cookies[:marker]
      end

      def _new_marker?
        params[:search][:marker].present? && params[:search][:marker] != cookies[:marker]
      end

      def _from_affiliate?
        NanoApi::Client.affiliate_marker?(params[:search][:marker])
      end

      def _current_non_affiliate?
        !NanoApi::Client.affiliate_marker?(cookies[:marker])
      end
    end
  end
end
