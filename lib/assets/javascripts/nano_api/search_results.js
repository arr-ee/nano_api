
NANO.plugin(function (NANO) {

  var Currency = NANO.Currency;

  var SearchResults = NANO.SearchResults = {

    _prepare: {},
    _construct: {},

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
          var data_object = self._construct[name];
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
      this._construct[field] = constructor;
    },

    customize: function (process_type, name, handler) {
      var constructor = this["_" + process_type][name];
      handler.call(constructor.prototype);
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

  SearchResults.process("airlines", Data);
  SearchResults.process("airports", Data);
  SearchResults.process("closest_cities", Data);
  SearchResults.process("currency_rates", Data);
  SearchResults.process("minimal_prices", Data);
  SearchResults.process("params_attributes", Data);

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

  SearchResults.process("gates_info", Gates);


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

  SearchResults.prepare("tickets", Ticket);

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

  SearchResults.process("tickets", Tickets);
});

/*
results.tickets.get();
results.tickets.filter({}).get();
results.tickets.filter({}).sort({}).get();
results.tickets.filter({}).sort({}).filter().get();
*/

//например так можно будет добавить фильтры

//NANO.SearchResults.customize(function(search_results) {

//});
