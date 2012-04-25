module NanoApi
  module Extensions
    module Markerable
      extend ActiveSupport::Concern

      included do
        helper_method :marker
      end

    private

      def handle_marker
        params[:marker] ||= params[:ref]
        if _new_marker? && (_from_affiliate? || _current_non_affiliate?)
          cookies[:marker] = {
            :value => params[:marker],
            :expires => 30.days.from_now
          }
        end
      end

      def marker
        @marker ||= cookies[:marker]
      end

      def _new_marker?
        params[:marker].present? && params[:marker] != cookies[:marker]
      end

      def _from_affiliate?
        NanoApi::Client.affilate_marker?(params[:marker])
      end

      def _current_non_affiliate?
        !NanoApi::Client.affilate_marker?(cookies[:marker])
      end
    end
  end
end
