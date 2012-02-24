module NanoApi
  module SearchesHelper
    def trip_classes_map
      {
        t('nano_api.searches.helpers.trip_classes.economy_upcase') => 0,
        t('nano_api.searches.helpers.trip_classes.business_upcase') => 1,
        t('nano_api.searches.helpers.trip_classes.first_upcase') => 2
      }
    end
  end
end
