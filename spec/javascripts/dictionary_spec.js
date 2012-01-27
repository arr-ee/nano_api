describe("fuzzy dictionary", function(){
  var test_dict = NANO.dictionary.create("test", dictionary_test_data);
  waitsFor(function(){
    return test_dict.ready;
  });
  it("strict search", function(){});
  it("soft search", function(){});
  it("search by iata", function(){});
  it("get iata info", function(){});
  it("get city info", function(){});
  it("is city", function(){});
});