(function (searchResults) {
  searchResults.customize("prepare", "tickets", function(ticket_proto){
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
  
  searchResults.customize("process", "tickets", function(proto){

    proto.filter = function (filter_param) {

      var tickets = this._tickets;

      var first_params = {};

      var filter_diff = function(new_params){
        var diff = {};
        _.each(new_params, function(param, name){
          if(!_.isEqual(first_params[name], param)){
            diff[name] = param;
          }
        });
        return diff;
      };

      var filter_init = function(new_params){
        var params_diff = filter_diff(new_params);
        var filtered_tickets = _.select(tickets, function(ticket){
          return filter.apply(ticket.params.filter_data(), params_diff);
        });
        return filtered_tickets;
      };

      var filter = {
        apply: function(ticket_filter_data, filters){
          var m = this._match_functions;
          var failed_filter = _.detect(filters, function(filter_value, filter_name){
            return m[filter_name] && !m[filter_name](ticket_filter_data[filter_name], filter_value);
          });
          if(null == failed_filter){
            return true;
          }
          return false;
        },
        _match_functions:{
          price:  function(ticket_price, filter_prices){
            return $.is_in_range(filter_prices, ticket_price);
          },
          direct_flight_time: function(ticket_direct_flight_time, filter_direct_flight_time){
            return $.is_in_range(filter_direct_flight_time, ticket_direct_flight_time);
          },
          return_flight_time: function(ticket_return_flight_time, filter_return_flight_time){
            return $.is_in_range(filter_return_flight_time, ticket_return_flight_time);
          },
          flights_duration: function(ticket_flight_duration, filter_flight_duration){
            return $.is_includes_range(ticket_flight_duration, filter_flight_duration);
          },
          stops_duration: function(ticket_stops_durations, filter_stops_duration){
            var match = false;
            if(_.isEmpty(_.compact(ticket_stops_durations))){
              return true;
            }
            var matches = [];
            $.each(ticket_stops_durations, function(index, duration){
              matches.push($.is_in_range(filter_stops_duration, duration));
            });
            return !_.include(matches, false);
          },
          stops_count: function(ticket_stops_count, filter_stops_count){
            return this._check_list_param(filter_stops_count, [ticket_stops_count]);
          },
          alliances: function(ticket_alliances, filter_alliances){
            return this._strict_check_list_param(filter_alliances, ticket_alliances);
          },
          airlines: function(ticket_airlines, filter_airlines){
            return this._check_list_param(filter_airlines, ticket_airlines);
          },
          gates: function(ticket_gates, filter_gates){
            return this._check_list_param(filter_gates, ticket_gates);
          },
          origin: function(ticket_origin, filter_origins){
            return this._check_list_param(filter_origins, [ticket_origin]);
          },
          destination: function(ticket_destionation, filter_destinations){
            return this._check_list_param(filter_destinations, [ticket_destionation]);
          },
          stops_airports: function(ticket_airports, filter_airports){
            return ticket_airports.length ? this._strict_check_list_param(filter_airports, ticket_airports) : true;
          },
          _strict_check_list_param: function(list, values){
            var result = _.map(values, function(value){
              return !!list[value];
            });
            return !_.include(result, false);
          },
          _check_list_param: function(list, values){
            var result = _.detect(values, function(value){
              return !!list[value];
            });
            return result !== undefined;
          }
        }
      };


      this.filter_data = FilterData(tickets);

      alert(JSON.stringify(this.filter_data));

      // alert(filter_init(filter_param));

      return this._self(tickets);
    };
  });

}(NANO.searchResults))();
