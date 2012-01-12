module NanoApi
  class PlacesController < AplicationController
    def index
      if complete = Client.auto_complete_places(params[:temp])
        response.content_type = Mime::JSON
        render text: complete
      else
        render nothing: true
      end
    end
  end
end
