
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




    var match = {};


    match['price'] = function (ticket, filter) { return true; }

    match['direct_flight_time'] = function (ticket, filter) { return true; }

    match['return_flight_time'] = function (ticket, filter) { return true; }

    match['flights_duration'] = function (ticket, filter) { return true; }

    match['stops_duration'] = function (ticket, filter) { return true; }

    match['stops_count'] = function (ticket, filter) { return true; }

    match['alliances'] = function (ticket, filter) { return true; }

    match['airlines'] = function (ticket, filter) { return true; }

    match['gates'] = function (ticket, filter) { return true; }

    match['origin'] = function (ticket, filter) { return true; }

    match['destination'] = function (ticket, filter) { return true; }

    match['stops_airports'] = function (ticket, filter) { return true; }



});
