NANO.plugin(function (NANO) {

  var Currency = NANO.Currency;

  var searchResults = NANO.searchResults = {

    _prepare: {},
    _process: {},

    create: function (json, complete) {
      var search_results = json;

      var last_iterator = null;
      var self = this;
      _.each(this._prepare, function(constructor, field_name){
        var worker_params = {
          data: search_results[field_name] || [],
          iterator: function(item_data){
            return new constructor(item_data);
          },
          complete: function(results){
            search_results[field_name] = results;
          }
        };
        if(!last_iterator){
          last_iterator = NANO.AsyncWorker(worker_params);
        }else{
          last_iterator.then(worker_params);
        }
      });
      
      last_iterator.then({
        data: search_results,
        iterator: function(data, name){
          var data_object = self._process[name];
          var return_data = _.isFunction(data_object) ? new data_object(data) : data;
          return return_data;
          
        },
        complete: function(results){
          complete(results);
        }
      });
      return last_iterator;
    },

    prepare: function(field, constructor){
      this._prepare[field] = constructor;
    },

    process: function (field, constructor) {
      this._process[field] = constructor;
    },

    customize: function (process_type, name, handler) {
      var constructor = this["_" + process_type][name];
      handler.call(constructor, constructor.prototype);
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

  searchResults.process("airlines", Data);
  searchResults.process("airports", Data);
  searchResults.process("closest_cities", Data);
  searchResults.process("currency_rates", Data);
  searchResults.process("minimal_prices", Data);
  searchResults.process("params_attributes", Data);

  var Gates = function(json_data){
    this._data = {};
    var self = this;
    _.each(json_data, function(gate_data){
      self._data[gate_data.id] = gate_data;
    });
  };
  Gates.prototype = {
    get: function(id){
      return id ? this._data[id] : this._data;
    }
  };
  searchResults.process("gates_info", Gates);



  var Flights = function(flights_array){

    this.flights = _.map(flights_array, function(flight_json){
      return new Flight(flight_json);
    });
    // this.formatter = new FlightsFormatter(this);
    // Memoizer.apply(this);
  };
  Flights.prototype = {
    memoize: ['airlines', 'aircompany', 'duration', 'stops_count', 'stops_durations', 'stops_data'],
    get_flights_values: function(field_name, is_function, params){
      return _.map(this.flights, function(flight){
        return is_function ? flight[field_name].apply({}, params) : flight[field_name];
      });
    },
    duration: function(){
      return _.reduce(this.flights, function(duration, flight){
        return duration + flight.duration + flight.delay;
      }, 0);
    },
    numbers: function(){
      return this.get_flights_values("number");
    },
    airlines: function(){
      return _.uniq(this.get_flights_values("airline"));
    },
    stops_iatas: function(){
      return _.map(this.stops(), function(stop_data){
        return stop_data.iata;
      });
    },
    stops: function(){
      return _.compact(this.get_flights_values("stop_data", true));
    },
    main_airline: function(){
      return _(this.list()).chain().
        reduce(function(hash, flight){
          var airc = flight.airline;
          hash[airc] = hash.hasOwnProperty(airc) ? hash[airc] + flight.duration : flight.duration;
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
    stops_count: function(){
      return Math.max(this.list().length - 1, 0);
    },
    depart_timestamp: function(){
      return this.flights[0].depart_timestamp();
    },
    stops_durations: function(){
      return _.compact(_.uniq(this.get_flights_values("delay")));
    }
  };

  var Flight = function(flight_json){
    this.data = flight_json;
  };
  Flight.prototype = {
    depart_timestamp: function(){
      return this.data.departure * 1000;
    },
    arrival_timestamp: function(){
      return this.data.arrival * 1000;
    },
    stop_data: function(){
      if(this.data.delay && 0 < this.data.delay){
        return {
          iata: this.data.destination,
          delay: this.data.delay
        };
      }else{
        return null;
      }
    }
  };
  //добавляем сами билеты
  var Ticket = function(ticket_json){
    //здесь вся инициализация
    this._data = ticket_json;
    this.depart_flights = new Flights(ticket_json.depart_flights);
    this.return_flights = ticket_json.return_flights ? new Flights(ticket_json.return_flights) : false;
    var self = this;
    _.each(this.init_stack, function(method_name){
      self[method_name]();
    });
  };
  Ticket.prototype = {
    fn: Ticket.prototype,
    init_stack: []
  };
  searchResults.prepare("tickets", Ticket);




  var Tickets = function(tickets){
    this._tickets = tickets;
  };
  Tickets.prototype = {
    _constructor: Tickets,
    fn: Tickets.prototype,

    _self: function(tickets){
      return new this._constructor(tickets);
    },
    get: function(){
      return this._tickets;
    }
  };

  searchResults.process("tickets", Tickets);
});

/*
results.tickets.get();
results.tickets.filter({}).get();
results.tickets.filter({}).sort({}).get();
results.tickets.filter({}).sort({}).filter().get();
*/
