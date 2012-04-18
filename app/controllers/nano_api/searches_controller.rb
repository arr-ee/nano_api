module NanoApi
  class SearchesController < NanoApi::ApplicationController

    def new
    end

    def create
      search_result = Client.search(request.host, params)

      if search_result.present?
        forward_json(*search_result)
      else
        render json: {}, status: :internal_server_error
      end
    end
  end
end
