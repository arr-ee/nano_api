module NanoApi
  module Client
    module Click
      def click search_id, order_url_id
        post('searches/%d/order_urls/%d' % [search_id, order_url_id]).symbolize_keys
      rescue RestClient::ResourceNotFound
        nil
      end
    end
  end
end
