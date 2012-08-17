class NanoApi::Backends::SearchesController < NanoApi::ApplicationController

  def new
    @search = NanoApi::Search.new(user_location_attributes)
    @search.update_attributes(cookie_params)
    @search.update_attributes(search_params)
  end

  def show
    @search = NanoApi::Search.find(params[:id])
    render :new
  end

  def create
    @search = NanoApi::Search.new(search_params)
    cookies[:ls] = @search.attributes_for_cookies.slice(
      'origin_name', 'origin_iata', 'destination_name', 'destination_iata'
    ).to_json

    search_result = @search.search

    if search_result.present?
      forward_json(*search_result)
    else
      render json: {}, status: :internal_server_error
    end
  end

private

  def search_params
    params[:search].is_a?(Hash) ? params[:search] : params
  end

  def cookie_params
    JSON.parse(cookies[:ls].presence) rescue {}
  end

end
