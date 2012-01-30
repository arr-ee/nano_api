
NANO = (function () {

    var core = {
      LOCALE: "ru"
    };

    core.plugin = function (plugin) {

        plugin.call(core, core);
    }

    return core;

})();
