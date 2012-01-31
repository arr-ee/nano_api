describe("routes", function() {
  it("should be empty routes", function() {
    runs(function(){
      var routes = NANO.routes;
      expect(routes.autocomplete_path).toBeUndefined();
      expect(routes.click_path).toBeUndefined();
      expect(routes.month_minimal_prices).toBeUndefined();
      expect(routes.search_method).toBeUndefined();
      expect(routes.search_path).toBeUndefined();
      expect(routes.week_minimal_prices).toBeUndefined();
    });
  });
  it("get routes from form", function() {
    runs(function(){
      loadFixtures("form.html");
      NANO.routes.update($("#nano_search_form"));
      var routes = NANO.routes;
      expect(routes.autocomplete_path).toBe("/nano/places.json");
      expect(routes.click_path).toBe("/nano/clicks/new.json");
      expect(routes.month_minimal_prices).toBe("/nano/month_minimal_prices.json");
      expect(routes.search_method).toBe("post");
      expect(routes.search_path).toBe("/nano/searches.json");
      expect(routes.week_minimal_prices).toBe("/nano/week_minimal_prices.json");
    });
  });
});