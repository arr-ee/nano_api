NANO.search.customize("collection", "tickets", function(proto){
  var sort = function(tickets, method, order){
    var sorted_array = _.sortBy(tickets, method);
    return order === "desc" ? sorted_array.reverse() : sorted_array;
  };
  proto.sorting_methods = {
    "price": function(ticket){
      return ticket.minimal_price();
    },
    "depart_time": function(ticket){
      return ticket.direct_flights.depart_timestamp();
    },
    "arrival_time": function(ticket){
      return ticket.direct_flights.arrival_timestamp();
    },
    "airline": function(ticket){
      var airline = ticket.main_airline();
      return NANO.airlines.get(airline.iata).name;
    },
    "stops_count": function(ticket){
      var direct_stops_count = ticket.direct_flights.stops_count();
      var return_stops_count = ticket.return_flights ? ticket.return_flights.stops_count() : 0;
      return return_stops_count + direct_stops_count;
    },
    "duration": function(ticket){
      var direct_duration = ticket.direct_flights.duration();
      var return_duration = ticket.return_flights ? ticket.return_flights.duration() : 0;
      return return_duration + direct_duration;
    }
  };

  proto.init_stack.push(function(){
    this.sort("price", "asc");
  });

  proto.sort = function(param_name, order){
    this.sorting_info = {
      field: param_name,
      order: order
    };
    this.list = sort(this.list, this.sorting_methods[param_name], order);
    this._tickets_index = 0;
    return this;
  };
});