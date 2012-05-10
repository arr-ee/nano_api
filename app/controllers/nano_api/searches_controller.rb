module NanoApi
  class SearchesController < NanoApi::ApplicationController
    include NanoApi::Extensions::Markerable
    include NanoApi::Extensions::UserLocation

    before_filter :handle_marker, :only => :new

    def new
      @search = Search.new(search_params)
    end

    def show
      @search = Search.find(params[:id])
      render :new
    end

    def create
      @search = Search.new(params[:search])
      cookies[:ls] = @search.attributes_for_cookies.to_json

      search_result = @search.search(request.host)

      if search_result.present?
        forward_json(*search_result)
      else
        render json: {}, status: :internal_server_error
      end
    end

  private

    def search_params
      search_params = params[:search].is_a?(Hash) ? params[:search] : params
      geoip_defaults = begin
        {:origin_name => user_location[:name], :origin_iata => user_location[:iata]} if user_location.is_a?(Hash)
      rescue
        {}
      end
      search_params.reverse_merge!(geoip_defaults)
      cookie_defaults = JSON.parse(cookies[:ls].presence || '{}')
      search_params.reverse_merge!(cookie_defaults) if cookie_defaults.is_a?(Hash)
    end

  end
end
