NANO("api.currency", function (NANO) {

  var rates = {"rub": 1};
  var display_currencies = null;

  var currency = {

    DEFAULT: 'rub',

    update_rates: function(new_rates){
      rates = _.extend(rates, new_rates);
    },
    display_currencies: function(list){
      display_currencies = list;
    },
    get_rates: function(){
      var filtered_rates = {};
      if(!display_currencies){
        return _.clone(rates);
      }
      _.each(display_currencies, function(currency){
        currency = currency.toLowerCase();
        filtered_rates[currency] = rates[currency];
      });
      return filtered_rates;
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
  return currency;
});
