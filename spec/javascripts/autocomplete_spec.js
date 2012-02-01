describe("autocomplete", function() {

  var dictionary = NANO.dictionary.create("test", dictionary_test_data);
  var cities = null;
  NANO.autocomplete.set_dictionary(dictionary);

  beforeEach(function(){
    cities = null;
    waitsFor(function(){
      return dictionary.ready;
    });
  });

  it("search by string like IATA", function() {
    NANO.autocomplete.get("led", function(data){
      cities = data;
    });
    waitsFor(function(){
      return cities !== null;
    });
    runs(function(){
      expect(cities.length).toBe(1);
      expect(cities[0].iata).toBe("LED");
    });
  });
  it("search by string like city name", function() {
    NANO.autocomplete.get("масква", function(data){
      cities = data;
    });
    waitsFor(function(){
      return cities !== null;
    });
    var iatas = _.map(cities, function(city){
      return city.iata;
    });
    runs(function(){
      expect(cities.length).toBe(4);
      expect(cities[0].iata).toBe("MOW");
      expect(iatas).toContain("DME");
      expect(iatas).toContain("VKO");
      expect(iatas).toContain("SVO");
    });
  });
  it("search by string like city name on server with fail", function() {
    delete NANO.routes.autocomplete_path;
    NANO.autocomplete.get("Кандагар", function(data){ // Кандагара нет в тестовом словаре
      cities = data;
    });
    waitsFor(function(){
      return cities !== null;
    });
    runs(function(){
      expect(cities.length).toBe(0);
    });
  });
  it("search by string like city with ajax", function(){
    jasmine.Ajax.useMock();
    NANO.autocomplete.get("Кандагар", function(data){ // Кандагара нет в тестовом словаре
      cities = data;
    });
    var request = mostRecentAjaxRequest();
    request.response(test_responses.autocomplete.success);
    waitsFor(function(){
      return cities !== null;
    });
    runs(function(){
      expect(cities.length).toBe(2);
      expect(cities[0].iata).toBe("KDG");
      expect(cities[1].iata).toBe("NKG");
    });
  });
});