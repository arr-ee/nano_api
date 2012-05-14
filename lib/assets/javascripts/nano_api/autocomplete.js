NANO.plugin(function(NANO){
  var dictionary = null;

  var Source = function(dictionary, options){
    this.dict = dictionary;
    this.options = $.extend({}, this._default_options, options || {});
    return _.bind(this.get, this);
  };
  Source.prototype = {
    _default_options: {
      items_count: 10,
      path: "autocomplete_path"
    },
    current_ajax_requrest: null,
    get: function(term, handler){
      term = term.split(/,|\(/)[0];
      if(term.length === 0){
        return;
      }
      var results_handler = _.bind(function(matches, matches_term){
        if(matches_term !== term){
          return;
        }
        this._abort_request();
        handler(this.slice_and_sort(matches, term));
      }, this);
      if(!this._get_from_dictionary(term, results_handler)){
        this._get_form_ajax(term, results_handler);
      }
    },
    _abort_request: function(){
      if(this.current_ajax_requrest){
        this.current_ajax_requrest.abort();
      }
      this.current_ajax_requrest = null;
    },
    _get_ajax_params: function(){
      if(this.options.path){
        return {
          url: NANO.routes[this.options.path],
          dataType: "json"
        };
      }else{
        return this.options.ajax_params;
      }
    },
    _get_from_dictionary: function(term, handler){
      var results = null;
      if(this._is_iata(term)){
        results = this.dict.iata(term);
        results = results !== null ? [results] : null;
      }else {
        results = this.dict.softly(term);
      }
      if(results && 0 < results.length){
        handler(results, term);
        return true;
      }
      return false;
    },
    _is_iata_regexp: new RegExp(/^[a-zA-Z]*$/),
    _is_iata: function(term){
      return (term.length === 3 || term.length === 2) && this._is_iata_regexp.test(term); 
    },
    _get_form_ajax: function(term, handler){
      //пересмотреть позже логику для запросов на сервер
      if(term.length <= 2){
        return;
      }
      this._abort_request();
      var self = this;
      this.current_ajax_requrest = $.ajax($.extend(this._get_ajax_params(), {
        data: {term: term},
        success: function(data, status, xhr){
          if(self.current_ajax_requrest === xhr){
            handler(data, term);
          }
        }
      }));
    },
    slice_and_sort: function(matches, term){
      var short_term = term.length <= 3;
      return _.sortBy(matches, function(match_item){
        if(match_item.index){
          return match_item.index;
        }
        var distance = NANO.levenstain.calculate(term, match_item.name);
        return short_term ? 
          Math.min(NANO.levenstain.calculate(term, match_item.iata), distance) : 
          distance;
      }).slice(0, this.options.items_count);
    }
  };
     
  NANO.autocomplete = {
    create: function(dictionary, name, options){
      options = options || {};
      this[name] = {
        dictionary: dictionary,
        get: new Source(dictionary, options.source)
      };
    }
  };
  NANO.autocomplete.create(NANO.dictionary.create("places", window.AutocompletePlaces || []), "places");
});