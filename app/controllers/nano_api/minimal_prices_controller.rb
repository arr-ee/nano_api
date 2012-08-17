module NanoApi
  class MinimalPricesController < NanoApi::ApplicationController
    def week
      forward_json NanoApi.client.week_minimal_prices(params[:search_id], params[:direct_date], params[:return_date])
    end

    def month
      forward_json NanoApi.client.month_minimal_prices(params[:search_id], params[:month])
    end

    def nearest
      forward_json NanoApi.client.nearest_cities_prices(params[:search_id])
    end
  end
end
