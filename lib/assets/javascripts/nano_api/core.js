
NANO = (function () {

    var plugins = {};
    var core = {};

    core.plugins = plugins;

    core.plugin = function (plugin) {

        plugin(plugins);
    }

    return core;

})();
