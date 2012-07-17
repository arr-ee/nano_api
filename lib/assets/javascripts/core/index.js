//core

var NANO = (function($, _, window, undefined){
  var is_test_mode = window.TESTMODE || /_testmode_/g.test(location.search) || false;
  var reserved_names = ["unbind", "bind", "trigger", "module"];
  var global_core_events = ["dom:ready"];
  var modules_testing_objects = {};
  var core = null;

  if(!window.$){
    console.log("need jquery or jquery-like library");
  } else if(!window._){
    console.log("need underscore library");
  }
  
  var log = (function(){
    var logs = {};
    var log = function(log_type){
      if(is_test_mode){
        var data = _.rest(arguments);
        if(!logs[log_type]){
          logs[log_type] = [];
        }
        logs[log_type].push({
          name: log_type,
          time: +new Date(),
          data: data
        });
      }
    };
    log.get_table = function(){
      return logs;
    };
    log.all = function(){
      var all_data = [];
      _.each(logs, function(typed_logs){
        all_data.push(typed_logs);
      });
      return _.sortBy(logs, function(log){
        return log.time;
      });
    };
    return log;
  }());

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
 
  var events = (function(){
    var handler_call_delay = 5;
    var prepare_bind_params = function(events, handler, is_wait_all){
      if(is_wait_all){
        var all_events = events.split(" ");
        var waiter = handler;
        var event_data = {};
        handler = function(data, event){
          all_events = _.without(all_events, event.name);
          event_data[event.name] = data;
          if(all_events.length === 0){
            waiter(event_data, {
              name: events
            });
          }
        };
      }
      if(_.isString(events)){
        var bind_hash = {};
        _.each(events.split(" "), function(name){
          bind_hash[name] = handler;
        });
        return bind_hash;
      }
      return events;
    };
    var bind = function(events_hash, bind_hash){
      _.each(bind_hash, function(handler, name){
        if(core.events.states[name]){
          handler_call(handler, {name: name}, core.events.states[name]);
          return;
        }
        handler.id = handler.id || _.uniqueId(name + "_handler_");
        if(!events_hash.handlers[name]){
          events_hash.handlers[name] = {};
        }
        events_hash.handlers[name][handler.id] = handler;
      });
    };
    var unbind = function(handlers, event_name, handler){
      var id = handler.id;
      if(!id || !handlers[event_name]){
        return;
      }
      delete handlers[event_name][id];
    };
    var trigger = function(handlers_list, event_name, data, is_sync){
      var event_obj = {
        name: event_name
      };
      if(!is_sync){
          _.each(handlers_list, function(handler, id){
            set_zero_timeout(function(){
              handler_call(handler, event_obj, data);
            });
          });
      } else {
        _.each(handlers_list, function(handler){
          handler_call(handler, event_obj, data);
        });
      }
    };

    var handler_call = function(handler, event_obj, data){
      var start = +new Date();
      handler(data, event_obj);
      var time = +new Date() - start;
      log("execution time", time, event_obj.name, handler);
    };

    var sandbox_chain_trigger = function(sandbox, event_name, data, is_sync){
      if(!_.isEmpty(sandbox.node.children)){
        _.each(sandbox.node.children, function(child_module_data){
          sandbox_chain_trigger(child_module_data.sandbox, event_name, data, is_sync);
        });
      }
      if(sandbox.events.handlers[event_name]){
        trigger(sandbox.events.handlers[event_name] || {}, event_name, data, is_sync);
      }
    };

    return {
      create: function(sandbox){
        sandbox.events = {
          handlers: {},
          states: {}
        };

        sandbox.unbind = function(event_name, handler){
          unbind(event_name, handler);
        };

        sandbox.bind = function(events, handler, params){
          log("bind", arguments, sandbox);
          params = params || {};
          var is_wait_all = params.is_wait && _.isString(events) && _.isFunction(handler);
          var bind_hash = prepare_bind_params(events, handler, is_wait_all);
          bind(sandbox.events, bind_hash);
        };

        sandbox.trigger = function(event_name, data, params){
          if(_.isUndefined(params)){
            params = {};
          }
          log("trigger", arguments, sandbox);
          var common_params = null;
          var common_data = null;
          if(_.isString(event_name)){
            event_name = event_name.split(" ");
            common_params = params;
            common_data = data;
          }
          _.each(event_name, function(event_name, event_params){
            event_params = common_params || event_params || params || {};
            var event_data = common_data || event_params.data || data || {};

            if(!!event_params.is_state){
              core.events.states[event_name] = event_data;
            }
            sandbox_chain_trigger(core, event_name, event_data, !!event_params.is_sync);
          });
        };
        sandbox.wait = function(modules_list, handler){
          var events = [];
          _.each(modules_list, function(module_name){
            events.push(helpers.module_ready_event_name(module_name));
          });
          this.bind(events.join(" "), handler, {is_wait: true});
        };
        return sandbox;
      }
    };
  }());

  var helpers = {
    module_ready_event_name: function(path){
      return ["module", path || "core", "ready"].join(":");
    }
  };

  var modules = {
    create: function(node, module, parent_sandbox, path, data){
      if(!node.sandbox[parent_sandbox.module_name]){
        node.sandbox[parent_sandbox.module_name] = parent_sandbox.node.module_interface;
      }

      var module_interface = module.call(node.sandbox, node.sandbox, data);
      node.module_interface = module_interface || {};
      node.children = {};
      
      if(parent_sandbox.node.module_interface){
        parent_sandbox.node.module_interface[node.sandbox.module_name] = module_interface;
      }
      parent_sandbox[node.sandbox.module_name] = module_interface;

      var module_event_data = {
        path: path,
        name: node.sandbox.module_name,
        module: module_interface
      };

      parent_sandbox.trigger(parent_sandbox.module_name + ":child:ready", module_event_data);
      application.core.sandbox.trigger(helpers.module_ready_event_name(path), module_event_data, {is_state: true});

      return module_interface;
    },

    append_to_sandbox: function(sandbox, list, ready){
      var modules_events = [];
      var alliaces = {};
      var modules = [];

      _.each(list, function(module_name){
        if(!_.isString(module_name)){
          _.extend(alliaces, module_name);
          module_name = _.keys(module_name)[0];
        }
        modules.push(module_name);
      });
      sandbox.wait(modules, function(data){
        _.each(data, function(info){
          var root_name = alliaces[info.path] || info.path.split(".")[0];
          sandbox[root_name] = core[root_name];
          if(alliaces[info.path]){
            sandbox[alliaces[info.path]] = info.module;
          }
        });
        ready(sandbox);
      });
    }
  };

  var sandboxes = {
    create: function(node, description, ready_callback){
      var sandbox = function(module_name, module_func, description){
        if(_.isFunction(module_func)){
          if(description === undefined){
            description = {};
          }
          var sandbox_path = module_name.split(".");
          description.name = sandbox_path.pop();
          description.path = module_name;
          if(0 <= _.indexOf(reserved_names, description.name)){
            try {
              console.error("invalid module name: '" + description.name + "'. Don't use names: ", reserved_names.join(", "));
            }
            catch(e) {
              alert("invalid module name: '" + description.name + "'. Don't use names: ", reserved_names.join(", "));
            }
            return;
          }
         
          sandbox.bind(helpers.module_ready_event_name(sandbox_path.join(".")), function(){
            var sandbox = core;
            _.each(sandbox_path, function(name){
              sandbox = sandbox.node.children[name].sandbox;
            });
            sandbox.module(module_func, description);
          });
        }
      };

      node[description.name] = {
        sandbox: sandbox,
        children: {}
      };

      if(description.init_event){
        sandbox.init_event = description.init_event;
      }

      _.extend(sandbox, {
        module_name: description.name,
        path: description.path,
        node: node[description.name]
      }, this._sandbox_prototype);
      events.create(sandbox);
      if(description.require && description.require.length){
        if(description.config){
          var config = {};
          config[description.config] = "config";
          description.require.push(config);
        }
        modules.append_to_sandbox(sandbox, description.require, ready_callback);
      } else {
        ready_callback(sandbox);
      }
      return sandbox;
    },
    _sandbox_prototype: {
      module: function(module, description){
        var self = this;
        return sandboxes.create(this.node.children, description, function(sandbox){
          if(description.init_event){
            sandbox.bind(description.init_event, function(data, e){
              modules.create(sandbox.node, module, self, description.path, data);
            });
          } else {
            modules.create(sandbox.node, module, self, description.path);
          }
        });
      },
      set_zero_timeout: set_zero_timeout,
      test: function(testing_object){
        if(is_test_mode){
          modules_testing_objects[this.module_name] = testing_object;
        }
      }
    }
  };

  var application = {};
  core = sandboxes.create(application, {
    name: "core"
  }, function(sandbox){
    sandbox.node.module_interface = sandbox;
    if(is_test_mode){
      sandbox.node.module_interface._module_test_object_ = function(module_name){
        return modules_testing_objects[module_name];
      };
      sandbox.node.module_interface._log_ = log;
    }
  });
  core.trigger(helpers.module_ready_event_name(), {
    name: core.module_name,
    module: core.node.module_interface
  }, {is_state: true});

  if($.browser.msie && +$.browser.version <= 8){
    $.fx.off = true;
  }

  $(function(){
    core.trigger("dom:ready", {}, {is_state: true});
  });

  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };

  return core.node.module_interface;
}($, _, window));
