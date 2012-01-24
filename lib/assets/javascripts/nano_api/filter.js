(function (searchResults) {
  searchResults.customize("process", "tickets", function(proto){
    // реализация фильтров
    proto.filter = {};
  });

}(NANO.searchResults));
