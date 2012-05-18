NANO.search.customize("each", "tickets", function(ticket_proto){
  ticket_proto.current_info = function(){
    var filter = this.tickets.filter_state;
    var gates  = [];
    if(filter && filter.gates){
      var gates_filter = filter.gates;
      _.each(this.gates(), function(gate){
        if(gates_filter[gate.id]){
          gates.push(gate);
        }
      });
    }else{
      gates = this.gates();
    }
    return {
      gates: gates,
      price: gates[0].default_currency_price.value
    };
  };  
  ticket_proto.filter_data = function(){
    var direct_flights = this.direct_flights;
    var return_flights = this.return_flights;
    var get_flights_data = function(func_field){
      var results = [direct_flights[func_field]()];
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
      alliances: get_flights_data("alliances"),
      origin: this.direct_flights.origin(),
      destination: this.direct_flights.destination()
    };

    this.filter_data = function(){
      var current_info  = this.current_info();
      filter_data.price = current_info.price;
      filter_data.gates = _.map(current_info.gates, function(gate){
        return gate.id;
      });
      return filter_data;
    };
    return this.filter_data();
  };  
});

NANO.search.customize("collection", "tickets", function(proto){
  var utils = {
    strict_check_list_param: function(list, values){
      var result = _.map(values, function(value){
        return !!list[value];
      }) || [];
      return !_.include(result, false);
    },
    check_list_param: function(list, values){
      var result = _.detect(values, function(value){
        return !!list[value];
      });
      return !_.isUndefined(result);
    },
    is_in_list: function(list, value){
      return list[value] || false;
    },
    is_in_range: function(range, value){
      var number_value = +value;
      return _.isNumber(number_value) ? (range.min <= value) && (value <= range.max) : false;
    },
    is_includes_range: function(range, edges){
      return utils.is_in_range(range, edges[0]) && utils.is_in_range(range, edges[1]);
    }
  };
  var filter = {
    apply: function(tickets, filters){
      var self = this;
      var matchers = this.matchers;
      var failed_filter = null;
      var ticket_filter_data = null;
      return _.select(tickets, function(ticket){
        ticket_filter_data = ticket.filter_data();
        failed_filter = _.detect(filters, function(state, name){
          return matchers[name] && !matchers[name](state, ticket_filter_data[name]);
        }) || null;
        return failed_filter === null;
      });
    },
    matchers: {
      price: utils.is_in_range,
      direct_flight_time: utils.is_in_range,
      return_flight_time: utils.is_in_range,
      flights_duration: utils.is_includes_range,
      stops_duration: function(filter_stops_duration, ticket_stops_durations){
        var match = false;
        if(_.isEmpty(_.compact(ticket_stops_durations))){
          return true;
        }
        var matches = [];

        _.each(ticket_stops_durations, function(duration, index){
          matches.push(utils.is_in_range(filter_stops_duration, duration));
        });
        return !_.include(matches, false);
      },
      stops_count: function(filter_params, ticket_params){
        return utils.strict_check_list_param(filter_params, [_.max(ticket_params)]);
      },
      alliances: utils.check_list_param,
      airlines: utils.strict_check_list_param,
      gates: utils.check_list_param,
      origin: utils.is_in_list,
      destination: utils.is_in_list,
      stops_airports: function(filter_airports, ticket_airports){
        return ticket_airports.length !== 0 ? utils.strict_check_list_param(filter_airports, ticket_airports) : true;
      }
    }
  };

  var numeric_fields = ['price', 'stops_duration', 'direct_flight_time',
    'return_flight_time', 'flights_duration'];
  var string_fields = ['origin', 'destination', 'stops_airports', "alliances",
    'airlines', 'alliances', 'gates', 'stops_count'];
  var all_fields = _.keys(filter.matchers);


  var filterData = function (tickets_filter_data){
    var filter_data = {};
    var temp = {};

    _.each(all_fields, function (field){
      temp[field] = [];
    });
    _.each(tickets_filter_data, function (tickets_filter_data){
      _.each(all_fields, function (field){
        temp[field].push(tickets_filter_data[field]);
      });
    });

    _.each(all_fields, function (field){
      temp[field] = _.flatten(temp[field]);
    });


    _.each(numeric_fields, function (field){
      var min = _.min(temp[field]);
      var max = _.max(temp[field]);
      if (min !== max) {
        filter_data[field] = {'min': min, 'max': max};
      }
    });

    _.each(string_fields, function (field){
      _.each(_.uniq(temp[field]), function (value){
        if(!filter_data[field]){
          filter_data[field] = {};
        }
        filter_data[field][value] = true;
      });
    });
    return filter_data;
  };

  proto.init_stack.push(function create_filter_data(){
    this.filter_data = filterData(_.map(this.list, function(ticket){
      return ticket.filter_data();
    }));
  });
  
  proto._diff_filter_params = function(params){
    var filters = {};
    var filter_data = this.filter_data;
    _.each(params, function(param, name){
      filters[name] = _.extend({}, filter_data[name], param);
    });
    return filters;
  };

  proto.filter = function (filter_param) {
    var filters = this._diff_filter_params(filter_param);
    var filtered_tickets = filter.apply(this.list, filters);
    var tickets = this._self(filtered_tickets, {
      filter_state: filters
    });
    return tickets;
  };
});
