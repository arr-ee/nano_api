describe("Filter data", function(){

  var search_results_1 =null,
    search_results_2 = null,
    search_results_3 = null;

  var copied_search_json1 = {};
  
  _.each(search_json_1, function(value, key){
    copied_search_json1[key] = _.clone(value);
  });
  NANO.searchResults.create(copied_search_json1, function (search_results){
    search_results_1 = search_results;
  });

  var search_results_1_filter_data = {
    airlines: {
      "5N": true,
      FV: true,
      SU: true
    },
    destination: {
      LED: true
    },
    direct_flight_time: {
      max: 1327443600000,
      min: 1327397700000
    },
    flights_duration: {
      max: 585,
      min: 90
    },
    gates: {
      7: true,
      9: true,
      10: true,
      11: true,
      16: true,
      20: true,
      24: true,
      28: true
    },
    origin: {
      DME: true,
      SVO: true
    },
    price: {
      max: 9321.350999999999,
      min: 2835
    },
    stops_airports: {
      ARH: true,
      MRV: true,
      KGD: true
    },
    stops_count: {
      0: true,
      1: true
    },
    stops_duration: {
      max: 390,
      min: 240
    }
  };

  beforeEach(function(){
    waitsFor(function(){
      return search_results_1 !== null;
    });
  });

  it("make filter data 1", function(){
    runs(function(){
      var filter_data = search_results_1.tickets.filter_data;
      expect(filter_data).toEqual(search_results_1_filter_data);
    });
  });
  it("make filter data speed test", function(){
    runs(function(){
      var filter_data_function = _.detect(search_results_1.tickets.init_stack, function(func){
        return func.name === "create_filter_data";
      });
      var count = 1000;
      var start = +new Date();
      while(count--){
        filter_data_function.call(search_results_1.tickets);
      }
      var end  = +new Date();
      expect(end - start).toBeLessThan(280);
    });
  });

});