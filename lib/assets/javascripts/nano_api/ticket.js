
NANO.plugin(function (NANO) {

  var Currency = NANO.Currency;

  var SearchResultsFabric = NANO.SearchResultsFabric = {

    _construction: [],
    _customization: [],

    create: function (json, complete) {
      var search_results = {};
      NANO.AsyncWorker({
        data: this._construction,
        iterator: function(construct_data){
          var field = construct_data.field;
          search_results[field] = construct_data.handler(json[field]);
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

    process: function (field, handler) {
      this._construction.push({
        field: field,
        handler: handler
      });
    },

    customize: function (handler) {
      this._customization.push(handler);
    }
  };


  SearchResultsFabric.process("airlines", function (airlines) {
    return {
      get: function(iata){
        return airlines[iata];
      }
    };
  });


  SearchResultsFabric.process("airports", function (airports) {
    return {
      get: function(iata){
        return airports[iata];
      }
    };
  });


  SearchResultsFabric.process("closest_cities", function (closest_cities) {
    return {
      get: function(){
        return closest_cities;
      }
    };
  });


  SearchResultsFabric.process("currency_rates", function (currency_rates) {
    return {
      get: function(){
        return currency_rates;
      }
    };
  });


  SearchResultsFabric.process("gates_info", function (gates_info_origin) {
    var gates_info = {};
    _.each(gates_info_origin, function (i) {
      gates_info[i.id] = i;
    });
    return {
      get: function(id){
        return gates_info[id];
      }
    };
  });


  SearchResultsFabric.process("minimal_prices", function (minimal_prices) {
    return {
      get: function(){
        return minimal_prices;
      }
    };
  });


  SearchResultsFabric.process("params_attributes", function (params_attributes) {
    return {
      get: function(){
        return params_attributes;
      }
    };
  });


  //добавляем сами билеты
  var Ticket = function(ticket_json){
    //здесь вся инициализация
  };
  Ticket.prototype = {};

  SearchResultsFabric.process("tickets", function (tickets) {
    tickets = _.map(tickets, function(ticket_json){
      return new Ticket(ticket_json);
    });
    return {
      all: function(){
        return tickets;
      }
    };
  });
});



//например так можно будет добавить фильтры

//NANO.SearchResultsFabric.customize(function(search_results) {

//});
