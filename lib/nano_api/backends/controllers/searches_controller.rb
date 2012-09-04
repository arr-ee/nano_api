class NanoApi::Backends::SearchesController < NanoApi::ApplicationController

  def new
    @search = search_instance search_params
  end

  def show
    @search = NanoApi::Search.find(params[:id])
    render :new
  end

  def create
    @search = NanoApi::Search.new(search_params)
    cookies[:search_params] = {
      :value => @search.search_params.to_json,
      :domain => (request.domain if request.domain.include?('.'))
    }

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

end
