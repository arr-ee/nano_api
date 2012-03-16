module NanoApi
  class ClicksController < ApplicationController
    def new
      if @click_form = Client.click(params[:search_id], params[:url_id])
        render stream: true
      else
        redirect_to new_searches_url
      end
    end
  end
end
