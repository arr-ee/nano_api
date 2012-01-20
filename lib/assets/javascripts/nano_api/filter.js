
NANO.plugin(function (sandbox) {

    var Filter = sandbox.Filter = {};
    var SearchResults = sandbox.SearchResults;


    // Текущие фильтры

    var filter = {};

    Filter.reset = function () {

        filter = {};
    };


    // Получает новые параметры фильтрации

    Filter.add = function (data) {

        var list = _.keys(data);

        _.each(list, function (i) {

            var value = data[i];

            if (_.isArray(value)) {

                filter[i] = value;
            } else {

                filter[i] = filter[i] || {};
                _.extend(filter[i], value);
            }
        });
    };

});
