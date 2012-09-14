class NanoApi::Backends::ClicksController < NanoApi::ApplicationController
  def new
    ActiveSupport::Deprecation.warn('Use `show` action, Luke.')
    show
  end

  def show
    if @click_form = NanoApi.client.click(params[:search_id],
      params[:id] || params[:url_id], {:unique => _uniq_click?('c')})
      render 'show', stream: true
    else
      redirect_to new_search_url
    end
  end

  def link
    @link_params = NanoApi.client.link(params[:search_id], params[:id], {:unique => _uniq_click?('l')})
    redirect_to @link_params.try(:[], :url).presence || new_search_url
  end

  def deeplink
    if @deeplink_params = NanoApi.client.deeplink(params[:search_id], params[:id],
      params.except(:id, :search_id).merge(:unique => _uniq_click?('l')))
      render 'deeplink', stream: true
    else
      redirect_to new_search_url
    end
  end

private

  def _uniq_click? scope, gate_id = _gate_id
    name = :"uc#{scope}#{gate_id}"
    clicked = cookies[name].present?
    cookies[name] = {
      :value => 1,
      :expires => 1.day.from_now
    } unless clicked
    clicked ? '0' : '1'
  end

  def _gate_id
    params[:gate_id]
  end

end
