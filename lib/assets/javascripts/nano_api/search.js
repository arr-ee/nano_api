NANO.plugin(function (NANO) {
  var search = NANO.search = {

    _each: {},
    _collection: {},
    _ready_callbacks: [],

    _init_sequence: [
      "airlines",
      "airports",
      "currency_rates",
      "closest_cities",
      "gates_info",
      "metadata",
      "minimal_prices",
      "params_attributes",
      "request_params",
      "tickets"
    ],

    _params_list: [
      "origin_iata",
      "destination_iata",
      "origin_name",
      "destination_name",
      "depart_date",
      "return_date",
      "trip_class",
      "range",
      "adults",
      "children",
      "infants",
      "marker"
    ],

    new_search: function(search_data){
      var self = this;
      var request_params = {};
      _.each(this._params_list, function(param_name){
        request_params[param_name] = search_data.data[param_name];
      });
      var ajax_params = {
        url: NANO.routes.search_path,
        type: NANO.routes.search_method,
        dataType: 'json',
        data: request_params,
        success: function(data){
          data.request_params = request_params;
          self.create(data, search_data.success);
        },
        error: search_data.error
      };
      NANO.ajax(ajax_params);
    },

    create: function (json, complete) {
      var search_results = _.extend({}, json);
      var self = this;
      var worker = null;

      _.each(this._init_sequence, function(field_name){
        var Collection = self._collection[field_name];
        var params = {
          data: search_results[field_name] || [],
          after: function(results){
            if(Collection){
              return new Collection(results);
            }
            return results;
          },
          complete: function(results){
            search_results[field_name] = results;
          }
        };
        if(self._each[field_name]){
          var Item = self._each[field_name];
          params.iterator = function(data){
            return new Item(data, search_results);
          };
        }
        if(!worker){
          worker = NANO.asyncWorker(params);
        }else{
          worker = worker.then(params);
        }
      });

      worker.then({
        data: search_results,
        complete: function(search_results){
          _.each(self._ready_callbacks, function(callback){
            callback(search_results);
          });
          complete(search_results);
        }
      });

      return worker;
    },

    each: function(field, constructor){
      this._each[field] = constructor;
    },

    collection: function (field, constructor){
      this._collection[field] = constructor;
    },

    customize: function (process_type, name, handler) {
      var constructor = this["_" + process_type][name];
      handler.call(constructor.prototype, constructor.prototype);
    },
    ready: function(callback){
      this._ready_callbacks.push(callback);
    }
  };

  var Data = function(json){
    this._data = json;
  };
  Data.prototype = {
    get: function(id){
      return id ? this._data[id] : this._data;
    }
  };

  search.collection("airlines", function(airlines){
    NANO.airlines.update(airlines);
    return NANO.airlines;
  });
  search.collection("airports", function(airports){
    NANO.airports.update(airports);
    return NANO.airports;
  });
  search.collection("closest_cities", Data);
  search.collection("minimal_prices", Data);
  search.collection("params_attributes", Data);
  search.collection("request_params", Data);

  search.collection("currency_rates", function(rates){
    NANO.currency.update_rates(rates);
    return rates;
  });

  search.collection("gates_info", function(gates_info){
    NANO.gates.update(gates_info);
    return NANO.gates;
  });

  var memoize = function(this_object){
    _.each(this_object.memoize, function(method_name){
      this_object[method_name] = _.memoize(this_object[method_name]);
    });
  };

  var Flights = function(flights_array, direction){
    this.direction = direction;
    this.flights = _.map(flights_array, function(flight_json){
      return new Flight(flight_json, direction);
    });
    memoize(this);
  };
  Flights.prototype = {
    memoize: ['airlines', 'aircompany', 'duration', 'stops_count', 'stops_durations', 'stops_iatas'],
    get_flights_values: function(field_name, is_function, params){
      return _.map(this.flights, function(flight){
        return is_function ? flight[field_name].apply(flight, params) : flight.data[field_name];
      });
    },
    list: function(){
      return this.flights;
    },
    origin: function(){
      return this.flights[0].origin();
    },
    destination: function(){
      return _.last(this.flights).destination();
    },
    duration: function(){
      return _.reduce(this.flights, function(duration, flight){
        return duration + flight.data.duration + flight.data.delay;
      }, 0);
    },
    numbers: function(){
      return this.get_flights_values("number");
    },
    airlines: function(){
      return _.uniq(this.get_flights_values("airline"));
    },

    airline: function(){
      return _(this.list()).chain().
        reduce(function(hash, flight){
          var airc = flight.airline();
          hash[airc] = hash.hasOwnProperty(airc) ? hash[airc] + flight.duration() : flight.duration();
          return hash;
        }, {}).
        map(function(flight_duration, aircompany_iata){
          return {
            duration: flight_duration,
            iata: aircompany_iata
          };
        }).
        max(function(info){
          return info.duration;
        }).
        value();
    },
    depart_timestamp: function(){
      return this.flights[0].depart_timestamp();
    },
    arrival_timestamp: function(){
      return _.last(this.flights).arrival_timestamp();
    },
    stops_iatas: function(){
      return _.map(this.stops(), function(stop_data){
        return stop_data.iata;
      });
    },
    stops: function(){
      return _.compact(this.get_flights_values("stop_data", true));
    },
    stops_count: function(){
      return Math.max(this.flights.length - 1, 0);
    },
    stops_durations: function(){
      return _.compact(_.uniq(this.get_flights_values("delay")));
    }
  };

  var Flight = function(flight_json, direction){
    this.direction = direction;
    this.data = flight_json;
  };
  Flight.prototype = {
    duration: function(){
      return this.data.duration;
    },
    number: function(){
      return this.data.number;
    },
    airline: function(){
      return this.data.airline;
    },
    origin: function(){
      return this.data.origin;
    },
    destination: function(){
      return this.data.destination;
    },
    depart_timestamp: function(){
      return this.data.departure * 1000;
    },
    arrival_timestamp: function(){
      return this.data.arrival * 1000;
    },
    stop_data: function(){
      if(this.data.delay && 0 < this.data.delay){
        return {
          iata: this.data.origin,
          delay: this.data.delay
        };
      }else{
        return null;
      }
    }
  };
  //добавляем сами билеты
  var Ticket = function(ticket_json, search){
    this.search = search;
    this.id = _.uniqueId("ticket_");
    this._data = ticket_json;
    var self = this;
    _.each(["direct", "return"], function(direction){
      var name = direction + "_flights";
      self[name] = ticket_json[name] ? new Flights(ticket_json[name], direction) : false;
    });
    _.each(this.init_stack, function(method_name){
      self[method_name]();
    });
    memoize(this);
  };
  Ticket.prototype = {
    fn: Ticket.prototype,
    init_stack: [],
    memoize: [],
    _default_url: function(url_id){
      return '/nano/clicks/new?search_id=' + this.search.search_id + '&url_id=' + url_id;
    },
    main_airline: function(){
      var direct_airline = this.direct_flights.airline();
      var return_airline = this.return_flights ? this.return_flights.airline() : {};
      return _.max([direct_airline, return_airline], function(airline){
        return airline.duration;
      });
    },
    send_gate_data: function(gate_id){
      if(!urls[id]){
        return;
      }
      var gate = _.detect(this.gates(), function(gate){
        return gate.id === gate_id;
      });
      NANO.ajax({
        url: this._default_url(gate.url_id) + '.js',
        type: "get",
        data: {
          click: {
            gate_id: gate.id,
            proposal_price: NANO.currency.to_default(gate.price)
          }
        }
      });
    },
    gates: function(){
      var ticket_gates = [];
      var self = this;
      var prices = this._data.native_prices;
      var gates = this.search.gates_info;
      var search = this.search;
      var urls = this.direct_order_urls;

      _.each(this._data.order_urls, function(url_id, id){
        var gate = gates.get(id);
        var gate_data = {
          ticket_id: self.id,
          id: id,
          name: gate.label,
          url_id: url_id,
          is_airline: gate.is_airline,
          payment_methods: gate.payment_methods,
          price: {
            currency: gate.currency_code,
            value: prices[id],
            default_currency_value: NANO.currency.to_default(prices[id], gate.currency_code)
          }
        };
        if(urls && urls[id]){
          gate_data.url = urls[id] + "|" + search.params.search.marker;
          gate_data.type = "direct";
        }else{
          gate_data.url = self._default_url(url_id);
          gate_data.type = "redirect";
        }
        ticket_gates.push(gate_data);
      });

      ticket_gates = ticket_gates.sort(function(gate_a, gate_b){
        return gate_a.price.default_currency_value < gate_b.price.default_currency_value ? (-1) : (1);
      });

      var param_cache = {};

      this.gates = function(param){
        if(param){
          if(!param_cache[param]){
            param_cache[param] =  _.map(ticket_gates, function(gate){
              return gate[param];
            });
          }
          return param_cache[param];
        }
        return ticket_gates.concat([]);
      };
      return this.gates();
    },
    minimal_price: function(){
      var gates = this.gates();
      var minimal_price_gate = _.min(gates, function(gate){
        return gate.price.default_currency_value;
      });
      this.minimal_price = function(){
        return minimal_price_gate.price.default_currency_value;
      };
      return this.minimal_price();
    }
  };
  search.each("tickets", Ticket);

  var Tickets = function(tickets, params){
    this.list = tickets;
    if(params){
      _.extend(this, params);
    }
    var self = this;
    _.each(this.list, function(ticket){
      ticket.tickets = self;
    });
    _.each(this.init_stack, function(method){
      method.call(self);
    });
    this._tickets_index = 0;
  };
  Tickets.prototype = {
    next_tickets_count: 10,
    _constructor: Tickets,
    fn: Tickets.prototype,
    init_stack: [],
    _self: function(tickets, params){
      return new this._constructor(tickets, params);
    },
    get: function(id){
      if(_.isString(id)){
        return _.detect(this.list, function(ticket){
          return ticket.id === id;
        });
      }
      return this.list;
    },
    next: function(count){
      var start = this._tickets_index;
      var end = start + (count || this.next_tickets_count);
      this._tickets_index = end;
      return this.list.slice(start, end);
    }
  };
  search.collection("tickets", Tickets);
});