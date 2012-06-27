NANO = (function () {  
  var set_zero_timeout = (function(sandbox){
    if(!window.postMessage){
      return function(func){
        setTimeout(func, 10);
      };
    }
    // Only add setZeroTimeout to the window object, and hide everything
    // else in a closure.
    var timeouts = [];
    var messageName = _.uniqueId("zero-timeout-message-");
   
    // Like setTimeout, but only takes a function argument.  There's
    // no time argument (always zero) and no arguments (you have to
    // use a closure).

    var zero_timeouts_count = 1000;
    var counter = 0;
    var set_zero_timeout = function(fn) {
      counter --;
      if(counter < 0){
        counter = zero_timeouts_count;
        return setTimeout(fn, 10);
      } else {
        timeouts.push(fn);
        return window.postMessage(messageName, "*");
      }
    };
   
    var handle_message = function(event) {
      if (event.source == window && event.data === messageName) {
        event.cancelBubble = true;
        event.returnValue = false;
        if(event.stopPropagation){
          event.stopPropagation();
        }
        if(event.preventDefault){
          event.preventDefault();
        }
        if(0 < timeouts.length){
          var fn = timeouts.shift();
          fn();
        }
      }
    };
   
    if(window.addEventListener){
      window.addEventListener("message", handle_message, true);
    }else if (window.attachEvent) {   // IE before version 9
      zero_timeouts_count = 10;
      window.attachEvent("onmessage", handle_message);
    }
   
    return set_zero_timeout;
  }());

  var core = function(module){
    module.call(core, core);
  };

  if(!window.$){
    console.log("need jquery or jquery-like library");
  } else if(!window._){
    console.log("need underscore library");
  }
  core.set_zero_timeout = set_zero_timeout;
  return core;
}());
