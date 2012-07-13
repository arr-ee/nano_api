//= require utils/index

NANO("utils.ajax", function(NANO){
  var make_request = function(params){
    if(window.$ && window.$.ajax){
      return window.$.ajax(params);
    } else {
      console.log("no ajax module found");
    }
  };

  return function(params){
    return make_request(params);
  };
});