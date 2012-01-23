
NANO.plugin(function (NANO) {

  var Currency = NANO.Currency;

  var SearchResultsFabric = NANO.SearchResultsFabric = {

    _prepare: {},
    _construct: {},

    create: function (json, complete) {
      var search_results = json;

      var last_iterator = null;

      _.each(this._prepare, function(field_name, constructor){
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
        data: this._construct,
        iterator: function(constructor, field_name){
          search_results[field_name] = new constructor(search_results[field_name]);
        }
      }).then({
        data: this._customization,
        iterator: function(handler){
          handler(search_results);
        },
        complete: function(){
          complete(search_results);
        }
      });
    },

    prepare: function(field, constructor){
      this._prepare[field] = constructor;
    },

    process: function (field, constructor) {
      this._construct[field] = constructor;
    },

    customize: function (process_type, name, handler) {
      var constructor = this["_" + process_type][name];
      handler.call(constructor.prototype);
    }
  };

  var Airlines = function(airlines_json){
    this._airlines = airlines_json;
  };
  Airlines.prototype = {
    get: function(iata){
      return this._airlines[iata];
    }
  };

  SearchResultsFabric.process("airlines", Airlines);


  var Airports = function(airports_json){
    this._airports = airports_json;
  };
  Airports.prototype = {
    get: function(iata){
      return this._airports[iata];
    }
  };

  SearchResultsFabric.process("airports", Airports);


  //добавляем сами билеты
  var Ticket = function(ticket_json){
    //здесь вся инициализация
    this._json = ticket_json;
    var self = this;
    _.each(this.init_stack, function(method_name){
      self[method_name]();
    });
  };
  Ticket.prototype = {
    fn: Ticket.prototype,
    init_stack: []
  };

  SearchResultsFabric.prepare("tickets", Ticket);

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

  SearchResultsFabric.process("tickets", Tickets);
});

/*
results.tickets.get();
results.tickets.filter({}).get();
results.tickets.filter({}).sort({}).get();
results.tickets.filter({}).sort({}).filter().get();
*/

//например так можно будет добавить фильтры

//NANO.SearchResultsFabric.customize(function(search_results) {

//});
