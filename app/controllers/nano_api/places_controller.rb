module NanoApi
  class PlacesController < ApplicationController
    def index
      if complete = Client.auto_complete_place(params[:term])
        forward_json complete
      else
        render nothing: true
      end
    end
  end
end
