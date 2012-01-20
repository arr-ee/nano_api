
NANO.plugin(function (sandbox) {

    var Currency = sandbox.Currency = {};


    /* Курсы валют, получаются с сервера */

    var rates = {"rub":1, "uah":3.98, "usd":31.87, "eur":40.28};


    /* Основная валюта для кажного из агенств, получаются с сервера */

    var gates = {"1":"rub","2":"rub","3":"rub","4":"eur","5":"rub","6":"rub","7":"rub","8":"uah","9":"rub","10":"rub","11":"eur","12":"rub","13":"rub","14":"rub","15":"rub","16":"eur","17":"rub","18":"rub","19":"eur","20":"rub","21":"rub","22":"eur","23":"rub","24":"rub","25":"rub","26":"usd","27":"rub"};


    /* Основная валюта */

    var DEFAULT = 'rub';


    Currency.set_default = function (value) {

        if (!rates[value]) {

            value = 'rub';
        }

        DEFAULT = value;
    };

    Currency.get_default = function (value) {

        return value;
    };


    /* Переводим сумму из одной валюты в другую */

    var convert = function (from, to, value) {

        return rates[from] * value / rates[to];
    };


    /* Переводим стоимость [билета] из валюты агетнства в основную */

    Currency.to_default = function(gate, value) {

        return (convert(gates[gate], DEFAULT, value)).toFixed(2);
    };

});
