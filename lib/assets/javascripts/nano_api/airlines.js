NANO.plugin(function(NANO){
  var airlines_list = [];
  var airlines = NANO.airlines = {
    update: function(airlines){
      airlines_list = $.extend({}, airlines, airlines_list);
    },
    get: function(airline_iata){
      return airlines_listp[airline_iata];
    }
  };
});