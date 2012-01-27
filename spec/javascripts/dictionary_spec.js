describe("fuzzy dictionary", function(){
  var build_start = +new Date();
  var test_dict = NANO.dictionary.create("test", dictionary_test_data);
  var build_end = +new Date();
  var start = +new Date();
  var end = null;

  var items_count = dictionary_test_data.length;

  waitsFor(function(){
    if(test_dict.ready){
      end = +new Date();
      return true;
    }
    return false;
  });
  it("dictionary init time", function(){
    runs(function(){
      var init_time = end - start;
      var build_time = build_end - build_start;
      expect(init_time).toBeLessThan(items_count * 5);
    });
  });
  it("strict search", function(){
    runs(function(){
      var data = test_dict.strictly("Масква");
      console.log(data);
      // expect(init_time).toBeLessThan(items_count * 5);
    });
  });
  it("soft search", function(){});
  it("search by iata", function(){});
  it("get iata info", function(){});
  it("get city info", function(){});
  it("is city", function(){});
});