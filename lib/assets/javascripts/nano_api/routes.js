NANO(function(NANO){
  var names_routes_list = ["search-path", "autocomplete-path", "click-path", "month-minimal-prices", "week-minimal-prices", "search-method"];
  NANO.routes = {
    update: function(form){
      if(0 < form.length) {
        _.each(names_routes_list, function(route_attr_name){
          var route_name = route_attr_name.replace(/-/g, "_");
          NANO.routes[route_name] = form.attr("data-" + route_attr_name);
        });
      }
    }
  };
  $(document).ready(function(){
    NANO.routes.update($("#nano_search_form"));
  });
});