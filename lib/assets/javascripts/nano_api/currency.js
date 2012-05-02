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

    convert: function (price, to, from) {
      if(!_.isNaN(+price)){
        var value = +price || 0;
        price = {
          value: value,
          currency: from
        };
      }
      return {
        value: rates[price.currency] * price.value / rates[to],
        currency: to
      };
    },

    to_default: function(price, currency) {
      return this.convert(price, this.DEFAULT, currency);
    },
    to_current: function(price, currency){
      return this.convert(price, this.current, currency || this.DEFAULT);
    },

    set_currency: function(code){
      this.current = code;
    }
  };
  currency.set_currency("usd");
});
