module NanoApi
  module Client
    module MinimalPrices
      def week_minimal_prices search_id, direct_date = nil, return_date = nil
        get_raw('minimal_prices',
          search_id: search_id, direct_date: direct_date, return_date: return_date
        )
      end

      def month_minimal_prices search_id, month = nil
        get_raw('month_minimal_prices', search_id: search_id, month: month)
      end
    end
  end
end
