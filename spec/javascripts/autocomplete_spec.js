describe("autocomplete", function() {

  var dictionary = NANO.dictionary.create("test_places", dictionary_test_data);
  NANO.autocomplete.set_dictionary(dictionary);
 
  it("search by string like IATA", function() {
    waitsFor(function(){
      return dictionary.ready;
    });
    var led = null;
    NANO.autocomplete.get("led", function(data){
      led = data;
    });
    waitsFor(function(){
      return led !== null;
    });
    runs(function(){
      expect(led.length).toBe(1);
      expect(led[0].iata).toBe("LED");
    });
  });
  it("search by string like city name", function() {
    var cities = null;
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
    var cities = null;
    NANO.routes.autocomplete_path = "//nano/places.json";
    NANO.autocomplete.get("Кандагар", function(data){ // Кандагара нет в тестовом словаре
      cities = data;
    });
    waitsFor(function(){
      return cities !== null;
    });
    var iatas = _.map(cities, function(city){
      return city.iata;
    });
    runs(function(){
      expect(cities.length).toBe(0);
    });
  });
});