NANO("api.airlines", function(NANO){
  var airlines_list = [];
  return {
    update: function(airlines){
      airlines_list = $.extend({}, airlines, airlines_list);
    },
    get: function(airline_iata){
      return airlines_list[airline_iata];
    }
  };
});