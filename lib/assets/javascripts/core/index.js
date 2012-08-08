//core

var NANO = (function($, _, window, undefined){
  var is_test_mode = window.TESTMODE || /_testmode_/g.test(location.search) || false;
  var reserved_names = ["unbind", "bind", "trigger", "module"];
  var global_core_events = ["dom:ready"];
  var modules_testing_objects = {};
  var core = null;
  var pending_modules = {};

  if(!window.$){
    console.log("need jquery or jquery-like library");
  } else if(!window._){
    console.log("need underscore library");
  }
  

  var debug = (function(){
    if(!is_test_mode){
      return function(){};
    }

    var state = {
      logs: {},
      modules: {
        ready: {},
        pending: {}
      }
    };

    var loggers = {
      log: function(log_type){
        var data = _.rest(arguments);
        if(!state.logs[log_type]){
          state.logs[log_type] = [];
        }
        state.logs[log_type].push({
          name: log_type,
          time: +new Date(),
          ready_time: null,
          data: data
        });
      },
      pending_module: function(description){
        var data = _.clone(description);
        data.pending_time = +new Date();
        state.modules.pending[data.path] = data;
      },
      ready_module: function(name){
        var pending_data = state.modules.pending[name];
        pending_data.ready_time = +new Date();
        state.modules.ready[name] = pending_data;
        delete state.modules.pending[name];
      }
    };

    var debug_interface = function(type){
      var logger = loggers[type] || loggers.log;
      logger.apply(loggers, _.rest(arguments));
    };

    debug_interface.state = function(){
      return state;
    };
    return debug_interface;
  }());

  var set_zero_timeout = (function(sandbox){
    var timeouts = [];
    var messageName = "zero-timeout-message-" + new Date().getTime();

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
      if (event.data === messageName) {
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
      debug("logs", "execution time", time, event_obj.name, handler);
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
          debug("logs", "bind", arguments, sandbox);
          params = params || {};
          var is_wait_all = params.is_wait && _.isString(events) && _.isFunction(handler);
          var bind_hash = prepare_bind_params(events, handler, is_wait_all);
          bind(sandbox.events, bind_hash);
        };

        sandbox.trigger = function(event_name, data, params){
          if(_.isUndefined(params)){
            params = {};
          }
          debug("logs","trigger", arguments, sandbox);
          event_params = params || {};
          var event_data = data || {};
          if(!!event_params.is_state){
            core.events.states[event_name] = event_data;
          }
          sandbox_chain_trigger(core, event_name, event_data, !!event_params.is_sync);
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

      node.sandbox.parent = parent_sandbox.node.module_interface;

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
      debug("ready_module", path);
      return module_interface;
    },

    append_to_sandbox: function(sandbox, list, ready){
      if(!list || list.length === 0){
        return ready(sandbox);
      }
      var modules_events = [];
      var alliaces = {};
      var modules = [];
      pending_modules[sandbox.name] = list;

      _.each(list, function(module_name){
        if(!_.isString(module_name)){
          _.extend(alliaces, module_name);
          module_name = _.keys(module_name)[0];
        }
        modules.push(module_name);
      });
      alliaces["utils.L10n"] = "t";
      sandbox.wait(modules, function(data){
        delete pending_modules[sandbox.name];
        _.each(data, function(info){
          var root_name = info.path.split(".")[0];
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
    _construct: {},
    _relates: {},
    is_valid_name: function(name){
      if(0 <= _.indexOf(reserved_names, name)){
        console.error("invalid module name: '" + name + "'. Don't use names: ", reserved_names.join(", "));
        return false;
      }
      return true;
    },
    cast_require: function(description){
      description.require = description.require || [];
      var require_extention = [];
      var self = this;
      _.each(description.require, function(module_name){
        if(self._relates[module_name]){
          require_extention = require_extention.concat(self._relates[module_name]);
        }
      });
      description.require = description.require.concat(require_extention);
      if(description.config){
        var config = {};
        config[description.config] = "config";
        description.require.push(config);
      }
      if(description.parent){
        description.require.push(description.parent);
      }
    },
    cast_description: function(path, description){
      if(description === undefined){
        description = {};
      }
      var sandbox_path = path.split(".");
      var name = sandbox_path.pop();
      var parent = sandbox_path.join(".");
      if(!this.is_valid_name(name)){
        return false;
      }
      
      description.name = name;
      description.path = path;
      description.parent = parent;
      this.cast_require(description);
      if(description.relate){
        this._relates[description.path] = description.relate;
      }
      return description;
    },
    create: function(node, description, ready_callback){
      var sandbox = function(path, module_func, description){
        if(_.isFunction(module_func)){
          description = sandboxes.cast_description(path, description);
          if(!description){
            return;
          }
          sandbox.bind(helpers.module_ready_event_name(description.parent), function(){
            var sandbox = core;
            if(description.parent){
              _.each(description.parent.split("."), function(name){
                sandbox = sandbox.node.children[name].sandbox;
              });
            }
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
      sandbox.sandbox_description = description;
      modules.append_to_sandbox(sandbox, description.require, ready_callback);
      return sandbox;
    },
    _sandbox_prototype: {
      _extentions: null,
      extend: function(extention){
        if(!extention){
          return;
        }
        if(!this._extentions){
          this._extentions = {};
        }
        _.extend(this._extentions, extention);
        _.extend(this, extention);
      },
      module: function(module, description){
        var self = this;
        debug("pending_module", description);
        return sandboxes.create(this.node.children, description, function(sandbox){
          sandbox.extend(self._extentions);
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
      sandbox.node.module_interface._debug_ = debug;
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
