NANO = (function () {  
  var core = function(module){
    module.call(core, core);
  };

  if(!window.$){
    console.log("need jquery or jquery-like library");
  } else if(!window._){
    console.log("need underscore library");
  }
  return core;
}());
