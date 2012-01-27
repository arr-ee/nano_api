NANO.plugin(function(NANO){
  var lib_ajax = null;
  if(window.$ && window.$.ajax){
    lib_ajax = window.$.ajax;
  }

  var make_request = function(params){
    return lib_ajax ? lib_ajax(params) : false;
  };

  NANO.ajax = function(params){
    return make_request(params);
  };
});