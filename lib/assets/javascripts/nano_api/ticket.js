
NANO.plugin(function (NANO) {

    var Currency = NANO.Currency;

    var SearchResultsFabric = NANO.SearchResultsFabric = {

        _construction: [],
        _customization: [],

        create: function (json) {
            var results = this._construct(json);
            return results;
            //return this._customizate(results);
        },

        _construct: function (json) {
          var search_results = {};
          _.each(this._construction, function(data) {
            search_results[data.field] = data.handler(json[data.field]);
          });
          return search_results;
        },

        _customizate: function (search_results) {
          _.each(this._customization, function(handler){
            handler(search_results);
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
        var list = [];
        _.each(airlines, function (data, iata) {
            data.iata = iata;
            list.push(data);
        });
        return list;
    });


    SearchResultsFabric.process("airports", function (airports) {
        var list = [];
        _.each(airports, function (i) {
            if (!i) {return false;}
            list.push({'iata': i});
        });
        return list;
    });


    SearchResultsFabric.process("tickets", function (tickets) {
        var list = [];
        _.each(tickets, function (i) {

            var price = [];

            _.each(i.native_prices, function (ppice, gate) {
                price.push(Currency.to_default(gate, ppice));
            });

            i.price = _.min(price);
            i.stops_count = _.max([i.return_flights.length, i.direct_flights.length]);
            i.direct_flight_time = i.direct_flights[0].departure;
            i.return_flights_time = i.return_flights[0].departure;

            list.push(i);
        });
        return list;
    });

});



//например так можно будет добавить фильтры

//NANO.SearchResultsFabric.customize(function(search_results) {

//});
