NANO.plugin(function(NANO){
  var default_params = {
    iterator: function(){},
    complete: function(){},
    delay: 1
  };

  var async_iterator = function(iteration, complete, delay){
    var hold = false;
    
    var async_iteration = function(){
      if(hold){
        return;
      }
      if(iteration()){
        current_iteration = setTimeout(async_iteration, delay || 0);
      }else{
        complete();
      }
    };
    var iterator = {
      start: function(){
        hold = false;
        async_iteration();
      },
      stop: function(){
        hold = true;
      }
    };
    return iterator;
  };

  var async_worker = function(params){
    params = _.extend({}, default_params, params);
    var working_data = [],
      keys = [],
      length = 0,
      results_data = [],
      current_iteration = null,
      next_worker = null;

    var iteration = function(){
      var next_index = keys.shift();
      if(!_.isUndefined(next_index)){
        results_data[next_index] = params.iterator(working_data[next_index], next_index);
        return true;
      }else{
        return false;
      }
    };

    var complete = function(){
      params.complete(results_data);
      if(next_worker !== null){
        next_worker.start(results_data);
      }
    };

    var get_working_data = function(data){
      working_data = data;
      keys = _.keys(working_data);
      results_data = _.isArray(data) ? [] : {};
    };

    var iterator = async_iterator(iteration, complete, params.delay);

    var worker = {
      params: params,
      start: function(data){
        if(!params.data){
          params.data = data;
        }
        get_working_data(params.data);
        iterator.start();
      },
      stop: function(){
        iterator.stop();
      },
      current_results: function(){
        return results_data;
      },
      then: function(next_params){
        var params = _.extend({}, next_params, {hold: true});
        next_worker = async_worker(params);
        return next_worker;
      }
    };

    if(!params.hold){
      worker.start();
    }
    return worker;
  };

  NANO.AsyncWorker = async_worker;
});