//= require utils/index

NANO("utils.worker", function(NANO){
  var default_params = {
    complete: function(){},
    after: function(){},
    iterator: function(data){return data;},
    delay: 1,
    batch_size: 20
  };

  var async_iterator = function(state, iterator, complete){
    var hold = false;
    var keys = _.keys(state.data);
    iterator = _.bind(iterator, state);
    var current_batch = 0;
    
    var async_iteration = function(){
      if(hold){
        return;
      }
      var next_index = null;
      while(current_batch){
        next_index = keys.shift();
        if(!_.isUndefined(next_index)){
          state.results[next_index] = iterator(state.data[next_index], next_index);
          current_batch --;
        }else{
          state.is_complete = true;
          return complete(state);
        }
      }
      current_batch = state.batch_size;
      return NANO.set_zero_timeout(async_iteration);
    };
    return {
      state: state, 
      start: function(){
        hold = false;
        NANO.set_zero_timeout(async_iteration);
      },
      stop: function(){
        hold = true;
      }
    };
  };


  var async_worker = function(params){
    params = _.extend({}, default_params, params);
    var state = {
      is_complete: false
    };

    var get_working_state = function(data){
      return {
        data: data,
        results: _.isArray(data) ? [] : {},
        batch_size: params.batch_size,
        is_complete: false
      };
    };

    var iterator = null;

    var worker = {
      data: params.data,
      start: function(data, start){
        if(!this.data){
          this.data = data;
        }
        _.extend(state, get_working_state(this.data));
        state.worker = this;
        iterator = async_iterator(state, params.iterator, function(state){
          var results = params.after(state.results) || state.results;
          params.complete.call(state.worker, results);
          if(state.next){
            state.next.start(results);
          }
        });
        iterator.start();
      },
      stop: function(){
        if(iterator){
          iterator.stop();
        }
      },
      current_results: function(){
        if(iterator){
          return iterator.state.results;
        }else {
          return null;
        }
      },
      then: function(next_params){
        var params = _.extend({}, next_params);
        if(state.is_complete){
          params.data = next_params.data || state.result;
        }else{
          params.hold = true;
        }
        state.next = async_worker(params);
        return state.next;
      }
    };

    if(!params.hold){
      worker.start();
    }
    return worker;
  };

  return async_worker;
});