module NanoApi
  module ApplicationHelper
    def nano_api_urls
      {
        search_path: searches_path(format: :json),
        search_method: :post,
        click_path: new_click_path(format: :json),
        autocomplete_path: places_path(format: :json),
        week_minimal_prices: week_minimal_prices_path(format: :json),
        month_minimal_prices: month_minimal_prices_path(format: :json)
      }
    end
  end
end
