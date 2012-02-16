module NanoApi
  class SearchesController < ApplicationController
    unloadable
    
    def new
    end

    def create
      search_params = params.reject{|key, value| %w[action controller format].include? key}
      search_result = Client.search('my_additional_marker', search_params)

      if search_result.present?
        forward_json search_result
      else
        render json: {}
      end
    end
  end
end
