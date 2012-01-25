(function () {
  console.log(NANO.searchResults);
  NANO.searchResults.customize("prepare", "tickets", function(ticket_proto){
    ticket_proto.current_price = function(){
      var gates = this.current_gates();
      return gates[0].price;
    };
    ticket_proto.current_gates = function(){
      var filter = this.tickets.filtration_params;
      if(!filter || !filter.gates){
        return this.gates();
      }
      var gates_filter = filter.gates;
      var gates = this.gates();
      var current_gates = [];
      _.each(gates, function(gate){
        if(gates_filter[gate.id]){
          current_gates.push(gate);
        }
      });
      current_gates = current_gates.sort(function(gate_a, gate_b){
        return gate_a.price < gate_b.price ? (-1) : (1);
      });
      return current_gates;
    };
    ticket_proto.filter_data = function(){
      var direct_flights = this.direct_flights;
      var return_flights = this.return_flights;
      var get_flights_data = function(func_field){
        var  results = [direct_flights[func_field]()];
        if(return_flights){
          results.push(return_flights[func_field]());
        }
        return _.flatten(results);
      };
      var filter_data = {
        direct_flight_time: direct_flights.depart_timestamp(),
        return_flight_time: return_flights ? return_flights.depart_timestamp() : null,
        flights_duration: get_flights_data("duration"),
        stops_airports: get_flights_data("stops_iatas"),
        stops_count: get_flights_data("stops_count"),
        stops_duration: get_flights_data("stops_durations"),
        airlines: get_flights_data("airlines"),
        origin: this.direct_flights.origin(),
        destination: this.direct_flights.destination()
      };

      this.filter_data = function(){
        filter_data.price = this.current_price();
        filter_data.gates = this.current_gates();
        return filter_data;
      };
      return this.filter_data();
    };  
  });

}());
