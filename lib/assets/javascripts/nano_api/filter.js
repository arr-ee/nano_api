(function (searchResults) {
  searchResults.customize("process", "tickets", function(proto){

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
          return this._is_in_range(filter_prices, ticket_price);
        },
        direct_flight_time: function(ticket_direct_flight_time, filter_direct_flight_time){
          return this._is_in_range(filter_direct_flight_time, ticket_direct_flight_time);
        },
        return_flight_time: function(ticket_return_flight_time, filter_return_flight_time){
          return this._is_in_range(filter_return_flight_time, ticket_return_flight_time);
        },
        flights_duration: function(ticket_flight_duration, filter_flight_duration){
          return this._is_includes_range(ticket_flight_duration, filter_flight_duration);
        },
        stops_duration: function(ticket_stops_durations, filter_stops_duration){
          var match = false;
          if(_.isEmpty(_.compact(ticket_stops_durations))){
            return true;
          }
          var matches = [];
          _.each(ticket_stops_durations, function(index, duration){
            matches.push(this._is_in_range(filter_stops_duration, duration));
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
        },

        _is_in_range: function(range, value){
          var number_value = +value;
          return _.isNumber(number_value) ? (_.first(range) <= value) && (value <= _.last(range)) : false;
        },

        _is_includes_range: function(range, edges){
          return this._is_in_range(edges, range[0]) && is_in_range(edges, range[1]);
        }
      }
    };

    var filter_init = function(tickets, params){
      var filtered_tickets = _.select(tickets, function(ticket){
        return filter.apply(ticket.filter_data(), params);
      });
      return filtered_tickets;
    };


    proto.filter = function (filter_param) {

      var filtered_tickets = filter_init(this._tickets, filter_param)

      this.filter_data = FilterData(_.map(filtered_tickets, function(ticket){
        return ticket.filter_data();
      }));

      return this._self(filtered_tickets);
    };
  });

}(NANO.searchResults))();
