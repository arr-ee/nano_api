module NanoApi
  class SearchesController < NanoApi::ApplicationController
    include NanoApi::Extensions::Markerable
    include NanoApi::Extensions::UserLocation

    before_filter :handle_marker, :only => :new

    def new
      @search = Search.new(params[:search])
    end

    def show
      @search = Search.find(params[:id])
      render :new
    end

    def create
      @search = Search.new(params[:search])
      search_result = @search.search(request.host)

      if search_result.present?
        forward_json(*search_result)
      else
        render json: {}, status: :internal_server_error
      end
    end
  end
end
