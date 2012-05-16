module NanoApi
  class MinimalPricesController < NanoApi::ApplicationController
    def week
      forward_json Client.week_minimal_prices(params[:search_id], params[:direct_date], params[:return_date])
    end

    def month
      forward_json Client.month_minimal_prices(params[:search_id], params[:month])
    end
  end
end
