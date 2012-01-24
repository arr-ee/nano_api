describe("Filter data", function(){

  var tickets, felter_result;

  tickets = [
    {
      direct_flight_time: 1327440000,
      return_flight_time: 1327565700,
      flights_duration: 180,
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
      flights_duration: 180,
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
      flights_duration: 180,
      stops_airports: ['ARH'],
      stops_count: '1',
      stops_duration: 60,
      airlines: 'SU',
      alliances: ['SkyTeam'],
      gates: [10, 24],
      origin: 'VKO',
      destination: 'LED',
      price: 4000
    }, {
      direct_flight_time: 1324440000,
      return_flight_time: 1324565700,
      flights_duration: 240,
      stops_airports: ['KGD'],
      stops_count: '1',
      stops_duration: 120,
      airlines: 'S7',
      alliances: ['SkyTeam'],
      gates: [16],
      origin: 'SVO',
      destination: 'LED',
      price: 7000
    }
  ];


  felter_result = {
    direct_flight_time: {min: 1324440000, max: 1327440000},
    return_flight_time: {min: 1324565700, max: 1327565700},
    flights_duration: {min: 180, max: 240},
    stops_airports: ['KGD', 'KGD'],
    stops_count: ['0', '1'],
    stops_duration: {min: 60, max: 120},
    airlines: ['SU', 'S7'],
    gates: [10, 16, 20, 24],
    origin: ['SVO', 'DME', 'VKO'],
    destination: ['LED'],
    price: {min: 2000, max: 700}
  };



  it("make filter data", function(){
    runs(function(){
      var filter_data = FilterData(tickets);
      expect(filter_data).toEqual(felter_result);
    });
  });

});