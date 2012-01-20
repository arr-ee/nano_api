
NANO = (function () {

    var core = {};

    core.plugin = function (plugin) {

        plugin.call(core, core);
    }

    return core;

})();
