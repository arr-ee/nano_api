describe("Search Results Fabric", function(){

  var search_results_1;

  var filter_data = {
    direct_flight_time: 1327403400000,
    return_flight_time: null,
    flights_duration: [90],
    stops_airports: [],
    stops_count: [0],
    stops_duration: [],
    airlines: ['FV'],
    gates: ["20", "28", "11", "16", "24", "9", "10"],
    origin: 'SVO',
    destination: 'LED',
    price: 2835
  };

  search_results_1 = null;

  var copied_search_json = {};
  
  _.each(search_json_1, function(value, key){
    copied_search_json[key] = _.clone(value);
  });

  NANO.searchResults.create(copied_search_json, function (search_results){
    search_results_1 = search_results;
  });

  beforeEach(function(){
    waitsFor(function(){
      return search_results_1 !== null;
    });
  });


  it("airlines", function(){
    runs(function(){
      var airline = search_results_1.airlines.get('SU');
      var airlines = search_results_1.airlines.get();
      expect(airline).toEqual(search_json_1.airlines.SU);
      expect(airlines).toEqual(search_json_1.airlines);
    });
  });

  it("airports", function(){
    runs(function(){
      var airport = search_results_1.airports.get('SVO');
      var airports = search_results_1.airports.get();
      expect(airport).toEqual(search_json_1.airports.SVO);
      expect(airports).toEqual(search_json_1.airports);
    });
  });

  it("closest cities", function(){
    runs(function(){
      var closest_cities = search_results_1.closest_cities.get();
      expect(closest_cities).toEqual(search_json_1.closest_cities);
    });
  });


  it("exchange rates", function(){
    runs(function(){
      var currency_rates = search_results_1.currency_rates;
      expect(currency_rates).toEqual(search_json_1.currency_rates);
    });
  });


  it("gates info", function(){
    runs(function(){
      var gate = search_results_1.gates_info.get(24);
      var gate1 = search_results_1.gates_info.get(10);
      var gate2 = search_results_1.gates_info.get(57);


      var expect_gate = _.detect(search_json_1.gates_info, function(gate){
        return gate.id === 24;
      });

      var expect_gate1 = _.detect(search_json_1.gates_info, function(gate){
        return gate.id === 10;
      });

      var expect_gate2 = _.detect(search_json_1.gates_info, function(gate){
        return gate.id === 57;
      });

      expect(gate).toEqual(expect_gate);
      expect(gate1).toEqual(expect_gate1);
      expect(gate2).toEqual(expect_gate2);
    });
  });

  it("minimal prices", function(){
    runs(function(){
      var minimal_prices = search_results_1.minimal_prices.get();
      expect(minimal_prices).toEqual(search_json_1.minimal_prices);
    });
  });


  it("params attributes", function(){
    runs(function(){
      var params_attributes = search_results_1.params_attributes.get();
      expect(params_attributes).toEqual(search_json_1.params_attributes);
    });
  });

  it("filter data", function(){
    runs(function(){
      var tickets = search_results_1.tickets.get();
      expect(tickets[0].filter_data()).toEqual(filter_data);
    });
  });


});