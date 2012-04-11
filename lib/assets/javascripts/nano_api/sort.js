NANO.search.customize("collection", "tickets", function(proto){
  var sort_params_mapping = {
    "price": "minimal_price"
  };
  var sort = function(tickets, param_name, order){
    var sorted_array = _.sortBy(tickets, function(ticket){
      return ticket[sort_params_mapping[param_name]]();
    });
    return order === "desc" ? sorted_array.reverse() : sorted_array;
  };
  proto.sort = function(param_name, order){
    this.list = sort(this.list, param_name, order);
    this._tickets_index = 0;
    return this;
  };
});