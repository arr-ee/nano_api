describe("Filter", function(){

  var search_results_1;
  beforeEach(function(){
    search_results_1 = null;
    var copied_search_json = {};
    _.each(search_json_1, function(value, key){
      copied_search_json[key] = _.clone(value);
    });
    NANO.search.create(copied_search_json, function (search_results){
      search_results_1 = search_results;
    });
    waitsFor(function(){
      return search_results_1 !== null;
    });
  });


  it("origin", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({origin: {'SVO': false}}).get();
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
      var tickets = search_results_1.tickets.filter({price: {min: 2000, max:5000}}).get();
      expect(tickets.length).toEqual(5);
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
      var tickets = search_results_1.tickets.filter({stops_airports: {'KGD': false, 'MRV': false}}).get();
      expect(tickets.length).toEqual(7);
    });
  });


  it("airlines", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({airlines: {'FV': false}}).get();
      expect(tickets.length).toEqual(3);
    });
  });

  it("two airlines", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({airlines: {'FV': false, "SU": false}}).get();
      expect(tickets.length).toEqual(1);
    });
  });


});