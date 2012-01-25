describe("Filter", function(){

  var search_results_1, search_json_1;

  search_json_1 = {
    params_attributes: {
      origin_iata: "MOW",
      destination_iata: "LED"
    },
    search_id: 24540561,
    metadata: {},
    tickets: [
      {
        total: 2835,
        native_prices: {20: 2835, 11: 72.0, 10: 3124, 16: 75.0, 28: 2900, 9: 3100, 24: 3100},
        order_urls: {20: 187, 11: 4, 10: 117, 16: 132, 28: 236, 9: 306, 24: 419},
        direct_flights: [
          {number: 126, airline: "FV", departure: 1327403400, arrival: 1327408800, duration: 90, delay: 0, origin: "SVO", destination: "LED", aircraft: null}
        ],
        main_airline: "FV",
        direct_order_urls: {20: "http: //www.onetwotrip.com/?s#2401MOWLED|FV|1|fn=126|tag=aviasales|id=d629222e-70ed-4b64-9f46-bb0a3be92db8|pas=1, 0, 0"}
      },
      {
        total: 2835,
        native_prices: {20: 2835, 11: 72.0, 10: 3124, 16: 75.0, 28: 2900, 9: 3100, 24: 3100},
        order_urls: {20: 184, 11: 5, 10: 104, 16: 131, 28: 237, 9: 305, 24: 422},
        direct_flights: [
          {number: 146, airline: "FV", departure: 1327422000, arrival: 1327427400, duration: 90, delay: 0, origin: "DME", destination: "LED", aircraft: null}
        ],
        main_airline: "FV",
        direct_order_urls: {20: "http: //www.onetwotrip.com/?s#2401MOWLED|FV|1|fn=146|tag=aviasales|id=d629222e-70ed-4b64-9f46-bb0a3be92db8|pas=1, 0, 0"}
      },
      {
        total: 2835,
        native_prices: {20: 2835, 11: 72.0, 10: 3124, 16: 75.0, 28: 2900, 9: 3100, 24: 3100},
        order_urls: {20: 186, 11: 6, 10: 112, 16: 134, 28: 238, 9: 304, 24: 420},
        direct_flights: [
          {number: 156, airline: "FV", departure: 1327432800, arrival: 1327438200, duration: 90, delay: 0, origin: "DME", destination: "LED", aircraft: null}
        ],
        main_airline: "FV",
        direct_order_urls: {20: "http: //www.onetwotrip.com/?s#2401MOWLED|FV|1|fn=156|tag=aviasales|id=d629222e-70ed-4b64-9f46-bb0a3be92db8|pas=1, 0, 0"}
      },
      {
        total: 2835,
        native_prices: {20: 2835, 11: 72.0, 10: 3124, 16: 75.0, 28: 2900, 9: 3100, 24: 3100},
        order_urls: {20: 185, 11: 7, 10: 101, 16: 129, 28: 239, 9: 303, 24: 417},
        direct_flights: [
          {number: 172, airline: "FV", departure: 1327440000, arrival: 1327445400, duration: 90, delay: 0, origin: "DME", destination: "LED", aircraft: null}
        ],
        main_airline: "FV",
        direct_order_urls: {
          20: "http: //www.onetwotrip.com/?s#2401MOWLED|FV|1|fn=172|tag=aviasales|id=d629222e-70ed-4b64-9f46-bb0a3be92db8|pas=1, 0, 0"
        }
      },
      {
        total: 2835,
        native_prices: {20: 2835, 11: 72.0, 10: 3824, 16: 75.0, 28: 2900, 9: 3800, 7: 2900, 24: 3100},
        order_urls: {20: 183, 11: 8, 10: 113, 16: 130, 28: 240, 9: 348, 7: 402, 24: 418},
        direct_flights: [
          {number: 182, airline: "FV", departure: 1327443600, arrival: 1327449000, duration: 90, delay: 0, origin: "DME", destination: "LED", aircraft: null}
        ],
        main_airline: "FV",
        direct_order_urls: {20: "http: //www.onetwotrip.com/?s#2401MOWLED|FV|1|fn=182|tag=aviasales|id=d629222e-70ed-4b64-9f46-bb0a3be92db8|pas=1, 0, 0"}
      },
      {
        total: 8568,
        native_prices: {28: 8568, 11: 213.1},
        order_urls: {28: 286, 11: 67},
        direct_flights: [
          {number: 4374, airline: "SU", departure: 1327416600, arrival: 1327425900, duration: 155, delay: 0, origin: "SVO", destination: "MRV", aircraft: null},
          {number: 4378, airline: "SU", departure: 1327440300, arrival: 1327451700, duration: 190, delay: 240, origin: "MRV", destination: "LED", aircraft: null}
        ]
      },
      {
        total: 9124,
        native_prices: {28: 9124, 16: 226.02, 11: 232.02},
        order_urls: {28: 292, 16: 174, 11: 68},
        direct_flights: [
          {number: 119, airline: "5N", departure: 1327397700, arrival: 1327404000, duration: 105, delay: 0, origin: "SVO", destination: "ARH", aircraft: null},
          {number: 321, airline: "5N", departure: 1327427400, arrival: 1327432800, duration: 90, delay: 390, origin: "ARH", destination: "LED", aircraft: null}
        ]
      },
      {
        total: 9187,
        native_prices: {11: 226.8},
        order_urls: {11: 69},
        direct_flights: [
          {number: 116, airline: "5N", departure: 1327416900, arrival: 1327423200, duration: 105, delay: 0, origin: "SVO", destination: "ARH", aircraft: null},
          {number: 4585, airline: "SU", departure: 1327440300, arrival: 1327446000, duration: 95, delay: 285, origin: "ARH", destination: "LED", aircraft: null}
        ]
      },
      {
        total: 9321,
        native_prices: {11: 230.1},
        order_urls: {11: 70},
        direct_flights: [
          {number: 755, airline: "SU", departure: 1327409100, arrival: 1327413000, duration: 125, delay: 0, origin: "SVO", destination: "KGD", aircraft: null},
          {number: 326, airline: "FV", departure: 1327413600, arrival: 1327422900, duration: 95, delay: 285, origin: "KGD", destination: "LED", aircraft: null}
        ]
      }
    ],

    airlines: {
      UT: {name: "UTair", id: 507, alliance_name: null, rates: 845, average_rate: 3.93},
      FV: {name: "GTK Rossia", id: 419, alliance_name: null, rates: 519, average_rate: 3.65},
      SU: {name: "Aeroflot", id: 10, alliance_name: "SkyTeam", rates: 1055, average_rate: 4.01},
      S7: {name: "S7", id: 444, alliance_name: "OneWorld", rates: 1236, average_rate: 3.9},
      UN: {name: "Transaero", id: 492, alliance_name: null, rates: 5, average_rate: 3.68},
      "5N": {name: "Aeroflot-Nord", id: 12, alliance_name: null, rates: 344, average_rate: 3.4},
      YQ: {name: "Polet Airlines", id: 407, alliance_name: null, rates: 109, average_rate: 3.98},
      BT: {name: "Air Baltic", id: 34, alliance_name: null, rates: 153, average_rate: 3.42},
      VV: {name: "Aerosvit Airlines", id: 23, alliance_name: null, rates: 493, average_rate: 3.07},
      OV: {name: "Estonian Air", id: 218, alliance_name: null, rates: 39, average_rate: 3.88},
      B2: {name: "Belavia", id: 139, alliance_name: null, rates: 185, average_rate: 3.54},
      GW: {name: "Air Lines Of Kuban", id: 54, alliance_name: null, rates: 357, average_rate: 3.78},
      SK: {name: "Scandinavian Airlines", id: 436, alliance_name: null, rates: 6, average_rate: 3.7},
      U9: {name: "Tatarstan Air", id: 483, alliance_name: null, rates: 392, average_rate: 3.02}
    },
    airports: {
      VKO: {name: "\u0412\u043d\u0443\u043a\u043e\u0432\u043e", city: "\u041c\u043e\u0441\u043a\u0432\u0430", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 94, average_rate: 3.37},
      LED: {name: "\u041f\u0443\u043b\u043a\u043e\u0432\u043e", city: "\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 90, average_rate: 2.81},
      SVO: {name: "\u0428\u0435\u0440\u0435\u043c\u0435\u0442\u044c\u0435\u0432\u043e", city: "\u041c\u043e\u0441\u043a\u0432\u0430", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 127, average_rate: 3.36},
      DME: {name: "\u0414\u043e\u043c\u043e\u0434\u0435\u0434\u043e\u0432\u043e", city: "\u041c\u043e\u0441\u043a\u0432\u0430", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 160, average_rate: 3.92},
      GOJ: {name: "\u041d\u0438\u0436\u043d\u0438\u0439 \u041d\u043e\u0432\u0433\u043e\u0440\u043e\u0434", city: "\u041d\u0438\u0436\u043d\u0438\u0439 \u041d\u043e\u0432\u0433\u043e\u0440\u043e\u0434", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 25, average_rate: 2.92},
      ROV: {name: "\u0420\u043e\u0441\u0442\u043e\u0432", city: "\u0420\u043e\u0441\u0442\u043e\u0432", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 38, average_rate: 3.46},
      ARH: {name: "\u0422\u0430\u043b\u0430\u0433\u0438", city: "\u0410\u0440\u0445\u0430\u043d\u0433\u0435\u043b\u044c\u0441\u043a", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 56, average_rate: 3.14},
      KRR: {name: "\u041f\u0430\u0448\u043a\u043e\u0432\u0441\u043a\u0438\u0439", city: "\u041a\u0440\u0430\u0441\u043d\u043e\u0434\u0430\u0440", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 108, average_rate: 2.8},
      KGD: {name: "\u041a\u0430\u043b\u0438\u043d\u0438\u043d\u0433\u0440\u0430\u0434", city: "\u041a\u0430\u043b\u0438\u043d\u0438\u043d\u0433\u0440\u0430\u0434", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 31, average_rate: 3.18},
      UFA: {name: "\u0423\u0444\u0430", city: "\u0423\u0444\u0430", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 59, average_rate: 3.93},
      MRV: {name: "\u041c\u0438\u043d\u0435\u0440\u0430\u043b\u044c\u043d\u044b\u0435 \u0412\u043e\u0434\u044b", city: "\u041c\u0438\u043d\u0435\u0440\u0430\u043b\u044c\u043d\u044b\u0435 \u0412\u043e\u0434\u044b", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 54, average_rate: 2.63},
      KUF: {name: "\u041a\u0443\u0440\u0443\u043c\u043e\u0447", city: "\u0421\u0430\u043c\u0430\u0440\u0430", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 78, average_rate: 3.47},
      AER: {name: "\u0410\u0434\u043b\u0435\u0440 - \u0421\u043e\u0447\u0438", city: "\u0410\u0434\u043b\u0435\u0440", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 93, average_rate: 2.67},
      VOZ: {name: "\u0427\u0435\u0440\u0442\u043e\u0432\u0438\u0446\u043a\u043e\u0435", city: "\u0412\u043e\u0440\u043e\u043d\u0435\u0436", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 22, average_rate: 2.95},
      NNM: {name: "\u041d\u0430\u0440\u044f\u043d-\u041c\u0430\u0440", city: "\u041d\u0430\u0440\u044c\u044f\u043d-\u041c\u0430\u0440", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 15, average_rate: 3.49},
      MMK: {name: "\u041c\u0443\u0440\u043c\u0430\u043d\u0441\u043a", city: "\u041c\u0443\u0440\u043c\u0430\u043d\u0441\u043a", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 26, average_rate: 2.81},
      KBP: {name: "\u0411\u043e\u0440\u0438\u0441\u043f\u043e\u043b\u044c", city: "\u041a\u0438\u0435\u0432", country: "\u0423\u043a\u0440\u0430\u0438\u043d\u0430", rates: 47, average_rate: 3.0},
      TLL: {name: "Ulemiste", city: "\u0422\u0430\u043b\u043b\u0438\u043d\u043d", country: "\u042d\u0441\u0442\u043e\u043d\u0438\u044f", rates: 9, average_rate: 3.33},
      MSQ: {name: "\u041d\u0430\u0446\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0439 \u0430\u044d\u0440\u043e\u043f\u043e\u0440\u0442 \u041c\u0438\u043d\u0441\u043a", city: "\u041c\u0438\u043d\u0441\u043a", country: "\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u044c", rates: 25, average_rate: 3.75},
      RIX: {name: "\u0420\u0438\u0433\u0430", city: "\u0420\u0438\u0433\u0430", country: "\u041b\u0430\u0442\u0432\u0438\u044f", rates: 16, average_rate: 3.82},
      ARN: {name: "Arlanda", city: "\u0421\u0442\u043e\u043a\u0433\u043e\u043b\u044c\u043c", country: "\u0428\u0432\u0435\u0446\u0438\u044f", rates: 12, average_rate: 4.06},
      KZN: {name: "\u041a\u0430\u0437\u0430\u043d\u044c", city: "\u041a\u0430\u0437\u0430\u043d\u044c", country: "\u0420\u043e\u0441\u0441\u0438\u044f", rates: 42, average_rate: 2.75}
    },
    gates_info: [
      {id: 7, label: "Ozon.travel", payment_methods: ["cash", "yandex_money", "web_money", "terminal", "card", "elexnet", "contact", "euroset"], currency_code: "rub"},
      {id: 9, label: "Bilet-on-Line", payment_methods: ["cash", "terminal", "card", "euroset"], currency_code: "rub"},
      {id: 10, label: "Agent", payment_methods: ["card", "yandex_money"], currency_code: "rub"},
      {id: 11, label: "Trip.ru", payment_methods: ["card", "euroset"], currency_code: "eur"},
      {id: 16, label: "BravoAvia", payment_methods: ["card"], currency_code: "eur"},
      {id: 20, label: "OneTwoTrip", payment_methods: ["card"], currency_code: "rub"},
      {id: 24, label: "Razlet.RU", payment_methods: ["card", "yandex_money", "web_money", "euroset", "svyaznoy"], currency_code: "rub"},
      {id: 28, label: "Tripsta", payment_methods: ["card"], currency_code: "rub"}
    ],
    currency_rates: {uah: 3.91, usd: 31.42, eur: 40.51},
    minimal_prices: {
      values: [[
        null,
        null,
        {0: 2070, 1: 6097, 2: 17020},
        {0: 2070, 1: 5474},
        {0: 2070, 1: 4344},
        {0: 2070, 1: 7110},
        {0: 2070, 1: 5339, 2: 13771}
      ]]
    },
    closest_cities: {
      lines: [
        {id: 24394, iata: "MOW", title: "\u041c\u043e\u0441\u043a\u0432\u0430, \u0420\u043e\u0441\u0441\u0438\u044f", distance: 0.0},
        {id: 24371, iata: "KZN", title: "\u041a\u0430\u0437\u0430\u043d\u044c, \u0420\u043e\u0441\u0441\u0438\u044f", distance: 704.04},
        {id: 24404, iata: "GOJ", title: "\u041d\u0438\u0436\u043d\u0438\u0439 \u041d\u043e\u0432\u0433\u043e\u0440\u043e\u0434, \u0420\u043e\u0441\u0441\u0438\u044f", distance: 362.76}
      ],
      columns: [
        {id: 24434, iata: "LED", title: "\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433, \u0420\u043e\u0441\u0441\u0438\u044f", distance: 0.0},
        {id: 27036, iata: "HEL", title: "\u0425\u0435\u043b\u044c\u0441\u0438\u043d\u043a\u0438, \u0424\u0438\u043d\u043b\u044f\u043d\u0434\u0438\u044f", distance: 299.77},
        {id: 27025, iata: "LPP", title: "\u041b\u0430\u043f\u043f\u0435\u0435\u043d\u0440\u0430\u043d\u0442\u0430, \u0424\u0438\u043d\u043b\u044f\u043d\u0434\u0438\u044f", distance: 180.46},
        {id: 27430, iata: "TLL", title: "\u0422\u0430\u043b\u043b\u0438\u043d, \u042d\u0441\u0442\u043e\u043d\u0438\u044f", distance: 308.56}
      ],
      values: [
        [{0: 2070}, {0: 5265}, null, null],
        [{0: 3822}, null, null, null],
        [null, null, null, null]
      ]
    }
  };


  beforeEach(function(){
    search_results_1 = null;
    var copied_search_json = {};
    _.each(search_json_1, function(value, key){
      copied_search_json[key] = _.clone(value);
    });
    NANO.searchResults.create(copied_search_json, function (search_results){
      search_results_1 = search_results;
    });
    waitsFor(function(){
      return search_results_1 !== null;
    });
  });


  it("stops_count", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({stops_count: 1}).get();
      expect(tickets.length).toEqual(4);
    });
  });

  it("price", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({price: [2000, 5000]}).get();
      expect(tickets.length).toEqual(6);
    });
  });


  it("origin", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({origin: {'DME': false}}).get();
      expect(tickets.length).toEqual(5);
    });
  });

  it("destination", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({destination: {'led': false}}).get();
      expect(tickets.length).toEqual(0);
    });
  });


  it("stops_airports", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({stops_airports: {'ARH': false}}).get();
      expect(tickets.length).toEqual(7);
    });
  });


  it("airlines", function(){
    runs(function(){
      var tickets = search_results_1.tickets.filter({airlines: {'FV': false}}).get();
      expect(tickets.length).toEqual(4);
    });
  });

});