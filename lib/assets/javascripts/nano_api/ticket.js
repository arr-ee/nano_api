
NANO.plugin(function (NANO) {

  var Currency = NANO.Currency;

  var SearchResultsFabric = NANO.SearchResultsFabric = {

    _prepare: {},
    _construct: {},

    create: function (json, complete) {
      var search_results = json;

      var last_iterator = null;
      var self = this;
      console.time("start");
      _.each(this._prepare, function(constructor, field_name){
        console.time("tickets");
        var worker_params = {
          data: search_results[field_name] || [],
          iterator: function(item_data){
            return new constructor(item_data);
          },
          complete: function(results){
            console.timeEnd("tickets");
            console.time("other");
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
        data: search_results, //this._construct,
        iterator: function(data, name){
          console.time(name);
          var data_object = self._construct[name];
          var return_data = _.isFunction(data_object) ? new data_object(data) : data;
          console.timeEnd(name);
          return return_data;
          
        },
        complete: function(results){
          console.timeEnd("other");
          console.log(results);
          console.timeEnd("start");
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

  SearchResultsFabric.process("airlines", Data);
  SearchResultsFabric.process("airports", Data);
  SearchResultsFabric.process("closest_cities", Data);
  SearchResultsFabric.process("currency_rates", Data);
  SearchResultsFabric.process("minimal_prices", Data);
  SearchResultsFabric.process("params_attributes", Data);


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
