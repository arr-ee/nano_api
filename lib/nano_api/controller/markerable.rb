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
            :domain => (request.domain if request.domain.include?('.')),
            :expires => 30.days.from_now
          }
        end

        _marker_redirect
      end

      def _new_marker?(marker)
        marker.present? && marker != cookies[:marker]
      end

      def _affiliate_marker?(marker)
        NanoApi::Client.affiliate_marker?(marker)
      end

      def _marker_redirect
        if request.get? && params[:marker].present? || params[:ref].present?
          # TODO: Passing just params.except(:ref, :marker) works too, but as of rspec-rails 2.11.0 fails at testing with anonymous controller
          redirect_to([
            request.path_info,
            request.query_parameters.except(:ref, :marker).to_query
          ].delete_if(&:blank?).join('?'), status: 301)
        end
      end

    end
  end
end
