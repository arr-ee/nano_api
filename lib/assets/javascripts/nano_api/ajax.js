NANO.plugin(function(NANO){
  var make_request = function(params){
    if(window.$ && window.$.ajax){
      window.$.ajax(params);
    }else{
      console.log("no ajax module found");
    }
  };

  NANO.ajax = function(params){
    return make_request(params);
  };
});