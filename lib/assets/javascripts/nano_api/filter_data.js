
window.FilterData = function (tickets) {

  var filter_data = {};
  var temp = {};

  var numeric_fields = ['price', 'stops_duration', 'direct_flight_time',
    'return_flight_time', 'flights_duration'];
  var string_fields = ['origin', 'destination', 'stops_airports',
    'airlines', 'alliances', 'gates', 'stops_count'];
  var all_fields = _.flatten([numeric_fields, string_fields]);

  _.each(all_fields, function (field){
    temp[field] = [];
  });

  _.each(string_fields, function (field){
    filter_data[field] = {};
  });

  _.each(tickets, function (ticket){
    _.each(all_fields, function (field){
      temp[field].push(ticket[field]);
    });
  });

  _.each(all_fields, function (field){
    temp[field] = _.flatten(temp[field]);
  });

  _.each(numeric_fields, function (field){
    var min = _.min(temp[field]);
    var max = _.max(temp[field]);
    if (min !== max) {
      filter_data[field] = {'min': min, 'max': max};
    }
  });

  _.each(string_fields, function (field){
    _.each(_.uniq(temp[field]), function (value){
      filter_data[field][value] = true;
    });
  });

  return filter_data;
};
