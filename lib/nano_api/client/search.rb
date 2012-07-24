module NanoApi
  module Client
    module Search
      SEARCH_PARAMS_KEYS = %w[
        origin_iata origin_name destination_iata destination_name
        depart_date return_date
        adults children infants
        trip_class range
      ].map(&:to_sym)

      def search host, params, options = {}
        params.symbolize_keys!
        marker = api_client_marker(params[:marker])
        search_params = params.slice(*SEARCH_PARAMS_KEYS).inject({}) do |result, (key, value)|
          result[key] = value if value.present?
          result
        end

        post('searches', {
          signature: api_client_signature(marker, search_params),
          enable_api_auth: true,
          search: {
            host: host,
            user_ip: current_request.try(:remote_ip),
            marker: marker,
            params_attributes: search_params
          }
        }, options.reverse_merge!(parse: false))
      rescue RestClient::ResourceNotFound, RestClient::BadRequest, RestClient::Forbidden => exception
        [exception.http_body, exception.http_code]
      rescue RestClient::InternalServerError
        nil
      end

      def search_params id
        result = get('/searches/%d' % id)
        result.merge!('one_way' => true) if result['return_date'].blank?
        result
      end

      def search_duration
        get('estimated_search_duration')['estimated_search_duration'].to_i
      end

      private

      def api_client_signature marker, params
        Digest::MD5.hexdigest(
          [NanoApi.api_token, marker, *params.values_at(*params.keys.sort)].join(?:)
        )
      end

      def api_client_marker additional_marker
        result = [additional_marker]
        result.unshift(NanoApi.marker) if NanoApi.marker.present?
        result.compact.join(?.)
      end
    end
  end
end
