module NanoApi
  class ClicksController < ApplicationController
    def new
      if @click_form = Client.click(params[:search_id], params[:url_id])
        render layout: false
      else
        redirect_to new_searches_url
      end
    end
  end
end
