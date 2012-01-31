NANO = (function () {  
  var core = {};
  core.plugin = function(){};

  if(!window.$){
    console.log("need jquery or jquery-like library");
  } else if(!window._){
    console.log("need underscore library");
  } else {
    core.plugin = function (plugin) {
      plugin.call(core, core);
    };
  }
  return core;
}());
