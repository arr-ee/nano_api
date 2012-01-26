describe("Filter", function(){

  var search_results_1;
  beforeEach(function(){
    search_results_1 = null;
    var copied_search_json = {};
    _.each(search_json_1, function(value, key){
      copied_search_json[key] = _.clone(value);
    });
    NANO.searchResults.create(copied_search_json, function (search_results){
      search_results_1 = search_results;
    });
    waitsFor(function(){
      return search_results_1 !== null;
    });
  });


  it("origin", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({origin: {'DME': true}}).get();
      expect(tickets.length).toEqual(4);
    });
  });


  it("stops_count", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({stops_count: {1: true}}).get();
      expect(tickets.length).toEqual(4);
    });
  });

  it("price", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({price: [2000, 5000]}).get();
      expect(tickets.length).toEqual(6);
    });
  });

  it("destination", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({destination: {'LED': true}}).get();
      expect(tickets.length).toEqual(9);
    });
  });


  it("stops_airports", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({stops_airports: {'ARH': true}}).get();
      expect(tickets.length).toEqual(2);
    });
  });


  it("airlines", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({airlines: {'FV': true}}).get();
      expect(tickets.length).toEqual(6);
    });
  });

});