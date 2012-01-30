NANO.plugin(function(NANO){
  var dictionary = NANO.dictionary.create("places", []);

  var request_handler = {
    set: function(term, handler){
      this._flush();
      this._term = term;
      this._handler = handler;
    },
    receive: function(term, data){
      if(this._term === term){
        this._handler(this._sort(data, term));
        this._flush();
      }
    },
    _flush: function(){
      this._term = null;
      this._handler = function(){};
    },
    _is_iata_regexp: new RegExp(/^[a-zA-Z]*$/),
    _is_iata: function(term){
      return (term.length === 3 || term.length === 2) && this._is_iata_regexp.test(term); 
    },
    _sort: function(matches, term){
      var iata_term = this._is_iata(term);
      return _.sortBy(matches, function(match_item){
        if(match_item.searches_count){
          return -match_item.searches_count;
        }
        return NANO.levenstain.calculate(term, match_item[iata_term ? "iata" : "name"]);
      });
    }
  };

  var ajax_data = {
    url: '/places_' + (NANO.LOCALE || "ru"),
    dataType: 'json'
  };

  var get_from_server = function(term){
    if(term.length <= 2){
      return;
    }
    NANO.ajax(_.extend(ajax_data, {
      data: {term: term},
      success: function(data, status, xhr){
        request_handler.receive(term, data);
      }
    }));
  };

  var get_from_dictionary = function(term){
    var results = dictionary.iata(term) || dictionary.softly(term);
    if(!results){
      return false;
    }
    results = _.isArray(results) ? results : [results];
    if(0 < results.length){
      request_handler.receive(term, results);
      return true;
    }
    return false;
  };

  var autocomplete = function(term, handler){
    request_handler.set(term, handler);
    if(!get_from_dictionary(term)){
      get_from_server(term);
    }
  };
});