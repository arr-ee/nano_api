describe("fuzzy dictionary", function(){
  var build_start = +new Date();
  var test_dict = NANO.dictionary.create("test", dictionary_test_data);
  var build_end = +new Date();
  var start = +new Date();
  var end = 0;

  var items_count = dictionary_test_data.length;

  beforeEach(function(){
    waitsFor(function(){
      if(test_dict.ready){
        end = +new Date();
        return true;
      }
      return false;
    });
  });
  

  it("dictionary init time", function(){
    runs(function(){
      var init_time = end - start;
      var build_time = build_end - build_start;
      expect(init_time).toBeLessThan(items_count * 5);
    });
  });
  it("strict search with results", function(){
    runs(function(){
      var data = test_dict.strictly("Масква");
      expect(data[0].iata).toBe("MOW");
      expect(data[0].name).toBe("Москва, Россия");
    });
  });
  it("strict search with no results", function(){
    runs(function(){
      var data = test_dict.strictly("Маскваasdjh");
      expect(data.length).toBe(0);
    });
  });
  it("soft search", function(){
    runs(function(){
      var data = test_dict.softly("Хаб"); // 
      var iatas = _.map(data, function(place_data){
        return place_data.iata;
      });
      expect(iatas).toContain("KHV");
      expect(iatas).toContain("HRK");
      expect(iatas).toContain("CHQ");
      expect(iatas).toContain("HFA");
    });
  });
  it("search by iata", function(){});
  it("get iata info", function(){});
  it("get city info", function(){});
  it("is city", function(){});
});