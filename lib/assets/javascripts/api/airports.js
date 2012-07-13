NANO("api.airports", function(NANO){
  var airports_list = [];
  return {
    update: function(airports){
      airports_list = $.extend({}, airports, airports_list);
    },
    get: function(airport_iata){
      return airports_list[airport_iata];
    }
  };
});