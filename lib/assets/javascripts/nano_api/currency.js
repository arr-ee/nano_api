
NANO.plugin(function (NANO) {

    /* Курсы валют, получаются с сервера */
    var rates = {"rub":1, "uah":3.98, "usd":31.87, "eur":40.28};

    /* Основная валюта для кажного из агенств, получаются с сервера */
    var gates = {"1":"rub","2":"rub","3":"rub","4":"eur","5":"rub","6":"rub","7":"rub","8":"uah","9":"rub","10":"rub","11":"eur","12":"rub","13":"rub","14":"rub","15":"rub","16":"eur","17":"rub","18":"rub","19":"eur","20":"rub","21":"rub","22":"eur","23":"rub","24":"rub","25":"rub","26":"usd","27":"rub"};


    var currency = NANO.currency = {

        DEFAULT: 'rub',

        set_default: function (value) {
            if (!rates[value]) {
                value = 'rub';
            }
            this.DEFAULT = value;
        },

        /* Переводим сумму из одной валюты в другую */
        convert: function (from, to, value) {
            return rates[from] * value / rates[to];
        },

        /* Переводим стоимость [билета] из валюты агетнства в основную */
        to_default: function(gate, value) {
            return (this.convert(gates[gate], this.DEFAULT, value)).toFixed(2);
        }
    };
});
