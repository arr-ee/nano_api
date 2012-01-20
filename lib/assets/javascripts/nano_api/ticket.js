
NANO.plugin(function (NANO) {
  var SearchResultsFabric = NANO.SearchResultsFabric = {};

  SearchResultsFabric = {
    _construction: [],
    _customization: [],
    create: function(json){
      var results = this._construct(json);
      return this._customizate(results);
    },
    _construct: function(json){
      var search_results = {};
      _.each(this._construction, function(data){
        search_results[data.field] = data.handler(json[data.field]);
      });
      return search_results;
    },
    _customizate: function(search_results){
      _.each(this._customization, function(handler){
        handler(search_results);
      });
    },
    process: function(field, handler){
      this._conveyer_construct.push({
        field: field,
        handler: handler
      });
    },
    customize: function(handler){
      this._conveyer_tune.push(handler);
    }
  };

  SearchResultsFabric.process("airlines", function(airlines){
    //...
  });
  SearchResultsFabric.process("tickets", function(airlines){
    //...
  });

  //....
  // далее так и добавляем остальные поля
});



//например так можно будет добавить фильтры 
NANO.SearchResultsFabric.customize("filters", function(search_results){
  
});
