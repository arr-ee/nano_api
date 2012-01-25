describe("Filter data", function(){

  var tickets_filter_data, tickets_filter_data2, felter_result, felter_result2;

  tickets_filter_data = [
    {
      direct_flight_time: 1327440000,
      return_flight_time: 1327565700,
      flights_duration: [180, 120],
      stops_airports: [],
      stops_count: '0',
      stops_duration: 0,
      airlines: 'SU',
      alliances: ['SkyTeam'],
      gates: [10, 20, 24],
      origin: 'SVO',
      destination: 'LED',
      price: 2000
    }, {
      direct_flight_time: 1326440000,
      return_flight_time: 1326565700,
      flights_duration: [180, 140],
      stops_airports: [],
      stops_count: '0',
      stops_duration: 0,
      airlines: 'SU',
      alliances: ['SkyTeam'],
      gates: [20, 24],
      origin: 'DME',
      destination: 'LED',
      price: 3000
    }, {
      direct_flight_time: 1325440000,
      return_flight_time: 1325565700,
      flights_duration: [100, 180],
      stops_airports: ['ARH'],
      stops_count: '1',
      stops_duration: [60],
      airlines: 'SU',
      alliances: ['SkyTeam'],
      gates: [10, 24],
      origin: 'VKO',
      destination: 'LED',
      price: 4000
    }, {
      direct_flight_time: 1324440000,
      return_flight_time: 1324565700,
      flights_duration: [120, 240],
      stops_airports: ['KGD'],
      stops_count: '1',
      stops_duration: [120],
      airlines: 'S7',
      alliances: ['SkyTeam'],
      gates: [16],
      origin: 'SVO',
      destination: 'LED',
      price: 7000
    }
  ];

  tickets_filter_data2 = [
    {
      direct_flight_time: 1327440000,
      return_flight_time: 1327565700,
      flights_duration: [150, 180],
      stops_airports: [],
      stops_count: '0',
      stops_duration: 0,
      airlines: 'SU',
      alliances: ['SkyTeam'],
      gates: [10, 20, 24],
      origin: 'SVO',
      destination: 'LED',
      price: 1000
    }, {
      direct_flight_time: 1326440000,
      return_flight_time: 1326565700,
      flights_duration: [90, 180],
      stops_airports: [],
      stops_count: '0',
      stops_duration: 0,
      airlines: 'SU',
      alliances: ['SkyTeam'],
      gates: [20, 24],
      origin: 'DME',
      destination: 'LED',
      price: 1000
    }, {
      direct_flight_time: 1325440000,
      return_flight_time: 1325565700,
      flights_duration: [50, 180],
      stops_airports: ['ARH'],
      stops_count: '1',
      stops_duration: [60],
      airlines: 'SU',
      alliances: ['SkyTeam'],
      gates: [10, 24],
      origin: 'VKO',
      destination: 'LED',
      price: 1000
    }, {
      direct_flight_time: 1324440000,
      return_flight_time: 1324565700,
      flights_duration: [190, 240],
      stops_airports: ['KGD'],
      stops_count: '1',
      stops_duration: [120],
      airlines: 'S7',
      alliances: ['SkyTeam'],
      gates: [16],
      origin: 'SVO',
      destination: 'LED',
      price: 1000
    }
  ];

  felter_result = {
    direct_flight_time: {min: 1324440000, max: 1327440000},
    return_flight_time: {min: 1324565700, max: 1327565700},
    flights_duration: {min: 100, max: 240},
    stops_airports: {'KGD': true, 'ARH': true},
    stops_count: {'0': true, '1': true},
    stops_duration: {min: 0, max: 120},
    airlines: {'SU': true, 'S7': true},
    alliances : {'SkyTeam': true},
    gates: {10: true, 16: true, 20: true, 24: true},
    origin: {'SVO': true, 'DME': true, 'VKO': true},
    destination: {'LED': true},
    price: {min: 2000, max: 7000}
  };

  felter_result2 = {
    direct_flight_time: {min: 1324440000, max: 1327440000},
    return_flight_time: {min: 1324565700, max: 1327565700},
    flights_duration: {min: 50, max: 240},
    stops_airports: {'KGD': true, 'ARH': true},
    stops_count: {'0': true, '1': true},
    stops_duration: {min: 0, max: 120},
    airlines: {'SU': true, 'S7': true},
    alliances : {'SkyTeam': true},
    gates: {10: true, 16: true, 20: true, 24: true},
    origin: {'SVO': true, 'DME': true, 'VKO': true},
    destination: {'LED': true}
  };


  _.each(_.range(98), function (){
    tickets_filter_data.push(tickets_filter_data[0]);
    tickets_filter_data.push(tickets_filter_data[1]);
    tickets_filter_data.push(tickets_filter_data[2]);
    tickets_filter_data.push(tickets_filter_data[3]);
  });


  it("make filter data", function(){
    runs(function(){
      var filter_data = FilterData(tickets_filter_data);
      expect(filter_data).toEqual(felter_result);
    });
  });

  it("make filter data (identical price)", function(){
    runs(function(){
      var filter_data = FilterData(tickets_filter_data2);
      expect(filter_data).toEqual(felter_result2);
    });
  });

  it("filter data calculating time", function(){
    var test_data_json = [];
    var all_tickets = tickets_filter_data.concat(tickets_filter_data2);
    _.times(250, function(index){
      test_data_json.push(all_tickets[index % all_tickets.length || 0]);
    });
    var start_time = +new Date();
    var filter_data = FilterData(test_data_json);
    var end_time = +new Date();
    expect(end_time - start_time).toBeLessThan(40);
  });

});