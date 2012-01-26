describe("Filter data", function(){

  var tickets_filter_data, search_results_1;

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

  it("make filter data", function(){
    runs(function(){
      var filter_data = search_results_1.tickets.filter_data;
      console.log(filter_data);
      // expect(filter_data).toEqual();
    });
  });

  it("make filter data (identical price)", function(){
    runs(function(){
      var filter_data = FilterData(tickets_filter_data2);
      expect(filter_data).toEqual(felter_result2);
    });
  });

  it("filter data calculating time", function(){
    var test_data_json = [];
    var all_tickets = tickets_filter_data.concat(tickets_filter_data2);
    _.times(250, function(index){
      test_data_json.push(all_tickets[index % all_tickets.length || 0]);
    });
    var start_time = +new Date();
    var filter_data = FilterData(test_data_json);
    var end_time = +new Date();
    expect(end_time - start_time).toBeLessThan(40);
  });

});