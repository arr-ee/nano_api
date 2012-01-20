
NANO.plugin(function (sandbox) {

    var SearchResults = sandbox.SearchResults = {};
    var Currency = sandbox.Currency;


    // Подбор минимальной цены для билета

    var OptimalPrice = function (data) {

        var price = [];

        _.each(data, function (p, g) {

            price.push(Currency.to_default(g, p));
        });

        return _.min(price);
    };


    SearchResults.make = function (json) {

        var SourceData = JSON.parse(json);

        var tickets = {};
        var airlines = {};
        var airrports = {};



        // Возвращает список билетов

        tickets.get = function () {

            var tickets = [];

            _.each(SourceData.tickets, function (i) {

                i.price = OptimalPrice(i.native_prices);

                tickets.push(i);
            });

            return tickets;
        };




        // Возвращает список аэропортов

        airrports.get = function () {

            var list = _.keys(SourceData.airports);
            var airports = [];

            _.each(list, function (i) {

                if (!i) {return false;}

                var value = {'iata': i};

                airports.push(value);
            });


            return airports;
        };



        // Возвращает список авиакомпаний

        airlines.get = function () {

            var list = _.keys(SourceData.airlines);
            var airlines = [];

            _.each(list, function (i) {

                var value = SourceData.airlines[i];
                value['iata'] = i;

                airlines.push(value);
            });

            return airlines;
        };



        return {tickets: tickets, airlines: airlines, airrports: airrports};
    };

});
