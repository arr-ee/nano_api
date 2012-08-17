class NanoApi::Backends::ClicksController < NanoApi::ApplicationController
  def new
    ActiveSupport::Deprecation.warn('Use `show` action, Luke.')
    show
  end

  def show
    if @click_form = NanoApi.client.click(params[:search_id], params[:id] || params[:url_id])
      render 'show', stream: true
    else
      redirect_to new_search_url
    end
  end

  def link
    @link_params = NanoApi.client.link(params[:search_id], params[:id])
    redirect_to @link_params.try(:[], :url).presence || new_search_url
  end

  def deeplink
    if @deeplink_params = NanoApi.client.deeplink(params[:search_id], params[:id], params.except(:id, :search_id))
      render 'deeplink', stream: true
    else
      redirect_to new_search_url
    end
  end
end
