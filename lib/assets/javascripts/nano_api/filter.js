(function (searchResults) {
  searchResults.customize("prepare", "tickets", function(proto){
    proto.filters_data = function(){
      return {
        // direct_flight_time: this.direct_flight_time,
        // return_flight_time: this.direct_flight_time || null,
        // flights_duration: 240,
        // stops_airports: ['KGD'],
        // stops_count: '1',
        // stops_duration: 120,
        // airlines: 'S7',
        // alliances: ['SkyTeam'],
        // gates: [16],
        // origin: 'SVO',
        // destination: 'LED',
        // price: 7000
      };
    };
  });

}(NANO.searchResults));
