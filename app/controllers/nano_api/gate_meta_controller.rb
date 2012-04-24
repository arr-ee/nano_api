module NanoApi
  class GateMetaController < NanoApi::ApplicationController
    def search_duration
      render json: NanoApi::Client.search_duration
    end
  end
end
