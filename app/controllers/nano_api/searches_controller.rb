module NanoApi
  class SearchesController < ApplicationController
    unloadable
    
    def new
    end

    def create
      search_result = Client.search('my_additional_marker',
        origin_iata: 'MOW',
        destination_iata: 'BKK',
        depart_date: Date.new(2012, 3, 20),
        return_date: Date.new(2012, 4, 20),
        adults: 2,
        children: 1,
        trip_class: 0
      )

      if search_result.present?
        forward_json search_result
      else
        render json: {}
      end
    end
  end
end
