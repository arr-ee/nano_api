NANO.plugin(function(NANO){
  var names_routes_list = ["search-path", "autocomplete-path", "click-path", "month-minimal-prices", "week-minimal-prices", "search-method"];
  NANO.routes = {};
  $(document).ready(function(){
    var form = $("#nano_search_form");
    _.each(names_routes_list, function(route_attr_name){
      var route_name = route_attr_name.replace(/-/g, "_");
      NANO.routes[route_name] = form.attr("data-" + route_attr_name);
    });
  });
});