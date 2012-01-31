NANO = (function () {
    var core = {
      LOCALE: "ru",
      routes: {
        search: "/nano/search.json",
        autocomplete: "/nano/places_" + core.LOCALE,
        month_minimal_prices: "/nano/month_minimal_prices",
        week_minimal_prices: "/nano/minimal_prices"
      }
    };
    core.plugin = function (plugin) {
        plugin.call(core, core);
    };
    return core;
}());
