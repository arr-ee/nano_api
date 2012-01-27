NANO.plugin(function(NANO){
  var StringsList = function(){
    this.list = {};
  };
  StringsList.prototype = {
    add: function(item){
      this.list[item] = {
        value: item
      };
    }
  };
  var StringsIndex = function(){
    this.index = {};
  };
  StringsIndex.prototype = {
    add: function(item){
      var length = item.length;
      if(!this.index.hasOwnProperty(length)){
        this.index[length] = new StringsList();
      }
      this.index[length].add(item);
    },
    get_items_by_length: function(length){
      var items = this.index[length] || {};
      return items.list || {};
    }
  };

  var helpers = {
    splitter: new RegExp(/\s*-|,|\s\s*/),
    get_search_strings: function(item){
      var strings = item.index_strings.join("|").toLowerCase();
      return _.uniq(strings.split("|"));
    },
    get_search_substrings: function(strings){
      var self = this;
      return _.flatten(_.map(strings, function(string){
        return self._string_substrings(string);
      }));
    },
    _string_substrings: function(string){
      var length = string.length;
      var substrings = [];
      while(1 < length){
        substrings.push(string.substr(0, length));
        length --;
      }
      return substrings;
    },
    process_item: function(item){
      var search_str = this.get_search_strings(item);
      return {
        paths: search_str,
        paths_index: this.get_search_substrings(search_str),
        data: item
      };
    }
  };
  
  var SearchTree = function(raw_data, complete){
    this.paths = new StringsIndex();
    this.tree = {};
    this._index = 0;
    var self = this;
    NANO.asyncWorker({
      data: raw_data, 
      iterator: _.bind(this.add_item(item), this),
      complete: complete
    });
  };

  SearchTree.prototype = {
    add_item: function(raw_item){
      var self = this;
      raw_item.index = this._next_index();
      var item = helpers.process_item(raw_item);
      this._add_paths_to_index(item.paths_index);
      _.each(item.paths, function(path){
        self._add_path(path, item.data);
      });
    },
    _next_index: function(){
      return this._index++;
    },
    _add_paths_to_index: function(paths){
      var self = this;
      _.each(paths, function(term){
        self.paths.add(term);
      });
    },
    _add_path: function(path, data){
      if(_.isNumber(+path) && path.length < 3){
        return;
      }
      this._construct_path(this.tree, path.split(''), data);
    },
    _construct_path: function(node, path_arr, data){
      _.each(path_arr, function(node_name){
        if(!node[node_name]){
          node[node_name] = {
            data: []
          };
        }
        node = node[node_name];
        node.data.push(data);
      });
    },
    get_node: function(path){
      var return_data = {
        node: null,
        status: "success",
        path: ""
      };
      if(!path){
        return_data.status = "error";
        return return_data;
      }
      var node_names = path.toLowerCase().split(''),
        next_node_name = node_names.shift(),
        node = this.tree;
        
      while(true){
        if(!node[next_node_name]){
          if(!!next_node_name){
            return_data.path += next_node_name;
            var path_length = return_data.path.length;
            return_data.status = "error";
          }
          break;
        }
        return_data.path += next_node_name;
        node = node[next_node_name];
        next_node_name = node_names.shift();
      }
      return_data.node = node;
      return return_data;
    },
    prices: {
      3: 0,
      5: 1,
      7: 2,
      20: 3
    },
    exact_search_price: 1,
    _leve_price: function(term){
      var length = term.length,
        last_price = 0;
      _.detect(this.prices, function(price, word_length){
        if(word_length > length){
          return true;
        }
        last_price = price;
        return false;
      });
      return last_price;
    },
    _check_array: function(words, term, length_price){
      var price = this._leve_price(term);
      return _.select(words, function(data, word){
        if(_.uniq(word + term).length <= length_price){
          return LevenstainLength.check(term, word, price);
        }
      });
    },
    _possible_values: function(term){
      var possible_paths = [];
      var term_length = term.length;
      var term_letters_count = _.uniq(term).length;
      var i = null;
      for(i = -1; i < 1; i++){
        var string_length = term_length + i;
        var search_words = this.paths.get_items_by_length(string_length);
        var length_price = term_letters_count + i + 1;
        possible_paths.push(this._check_array(search_words, term.substr(0, string_length), length_price));
      }
      return possible_paths;
    },
    _get_possible_values: function(term){
      var values = this._possible_values(term);
      return !!values[1].length ? values[1] : _.flatten(values);
    },
    _fuzzy_search: function(term){
      var values = this._get_possible_values(term);
      return !!values.length ? values : this._get_possible_values(sb.keyboard_switcher(term));
    },
    _get_items: function(paths){
      var self = this;
      return _.uniq(_.flatten(_.map(paths, function(path){
        return self.get_node(path.value).node.data;
      })));
    },
    soft_fuzzy_search: function(term){
      var near_terms = this._fuzzy_search(term.toLowerCase());
      return this._get_items(near_terms);
    },
    strict_fuzzy_search: function(term, term_price){
      term = term.toLowerCase();
      var price = term_price || this._leve_price(term);
      var result = _.select(this._fuzzy_search(term), function(path_data){
        return LevenstainLength.calculate(term, path_data.value) <= price;
      });
      if(result.length < 5 && result.length !== 0){
        return this.get_node(result[0].value);
      }
      return null;
    },
    iata_search: function(term){
      term = term.toLowerCase();
      items = this.soft_fuzzy_search(term);
      var result = _.detect(items, function(item){
        return term === item.iata.toLowerCase();
      }) || null;
      return result;
    }
  };
  
  var Dictionary = function(raw_array, name){
    this.name = name;
    var self = this;
    this.ready = false;
    this.tree = new SearchTree(raw_array, function(){
      self.ready = true;
    });
  };
  Dictionary.prototype = {
    strictly: function(term){
      return !!term ? this.tree.strict_fuzzy_search(term) : null;
    },
    softly: function(term){
      return !!term ? this.tree.soft_fuzzy_search(term) : null;
    },
    by_iata: function(term){
      return !!term ? this.tree.iata_search(term) : null;
    },
    iata_info: function(iata){
      return this.tree.get_node(iata);
    },
    city_info: function(city_name){
      var data = this.get_data(city_name);
      if(data.status !== "error"){
        return data.node.data[0];
      }
      return null;
    },
    is_city: function(term){
      var result = this.strict_search(term);
      if(!!result && result.status === 'success'){
        return result.path;
      }
    }
  };
  
  NANO.dictionary = {
    _list: [],
    create: function(name, raw_array){
      this._list[name] = new Dictionary(raw_array, name);
      return _list[name];
    },
    get: function(name){
      return this._list[name];
    }
  };
});