module NanoApi
  class ClicksController < NanoApi::ApplicationController
    def new
      if @click_form = Client.click(params[:search_id], params[:url_id])
        render stream: true
      else
        redirect_to new_search_url
      end
    end
  end
end
