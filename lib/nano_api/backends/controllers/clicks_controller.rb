class NanoApi::Backends::ClicksController < NanoApi::ApplicationController
  respond_to :html, :js

  def show
    if @click_form = NanoApi::Client.click(params[:search_id], params[:id] || params[:url_id])
      render
    else
      render nothing: true, status: :not_found
    end
  end

private

  def click_params
    NanoApi.client.click(params[:search_id], params[:id],
      {:unique => _uniq_click?('c')})
  end

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
