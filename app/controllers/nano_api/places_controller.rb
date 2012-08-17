module NanoApi
  class PlacesController < NanoApi::ApplicationController
    def index
      if complete = NanoApi.client.auto_complete_place(params[:term])
        forward_json complete
      else
        render nothing: true
      end
    end
  end
end
