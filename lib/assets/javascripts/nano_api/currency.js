NANO.plugin(function (NANO) {

  var rates = {"rub": 1, "uah": 3.98, "usd": 31.87, "eur": 40.28};

  var currency = NANO.currency = {

    DEFAULT: 'rub',

    update_rates: function(new_rates){
      rates = _.extend(rates, new_rates);
    },
    get_rates: function(){
      return rates;
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
    },
    to_current: function(value, currency){
      return this.convert(currency || this.DEFAULT, this.current, value);
    },

    set_currency: function(code){
      this.current = code;
    }
  };
  currency.set_currency(currency.DEFAULT);
});
