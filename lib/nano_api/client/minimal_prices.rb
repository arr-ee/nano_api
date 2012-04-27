module NanoApi
  module Client
    module MinimalPrices
      def week_minimal_prices search_id, direct_date = nil, return_date = nil
        get('minimal_prices.json',
            {search_id: search_id, direct_date: direct_date, return_date: return_date},
            parse_json: false
        )
      end

      def month_minimal_prices search_id, month = nil
        get('month_minimal_prices.json', {search_id: search_id, month: month}, parse_json: false)
      end
    end
  end
end
