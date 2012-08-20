module NanoApi
  class GateMetaController < NanoApi::ApplicationController
    def search_duration
      render json: NanoApi.client.search_duration
    end
  end
end
