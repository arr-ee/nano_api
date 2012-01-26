
NANO.plugin(function (NANO) {
  

  /* Курсы валют, получаются с сервера */
  var rates = {"rub": 1, "uah": 3.98, "usd": 31.87, "eur": 40.28};

  var currency = NANO.currency = {

    DEFAULT: 'rub',

    update_rates: function(new_rates){
      rates = _.extend(rates, new_rates);
    },

    set_default: function (value) {
        if (!rates[value]) {
            value = 'rub';
        }
        this.DEFAULT = value;
    },

    convert: function (from, to, value) {
      return rates[from] * value / rates[to];
    },

    to_default: function(value, from) {
      return this.convert(from, this.DEFAULT, value);
    }
  };
});
