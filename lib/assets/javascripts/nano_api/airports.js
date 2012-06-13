NANO(function(NANO){
  var airports_list = [];
  var airports = NANO.airports = {
    update: function(airports){
      airports_list = $.extend({}, airports, airports_list);
    },
    get: function(airport_iata){
      return airports_list[airport_iata];
    }
  };
});