module NanoApi
  class ClicksController < NanoApi::ApplicationController
    def new
      ActiveSupport::Deprecation.warn('Use `show` action, Luke.')
      show
    end

    def show
      if @click_form = Client.click(params[:search_id], params[:id] || params[:url_id])
        render 'show', stream: true
      else
        redirect_to new_search_url
      end
    end
  end
end
