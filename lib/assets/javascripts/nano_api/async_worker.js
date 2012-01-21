NANO.plugin(function(NANO){
  var default_params = {
    iterator: function(){},
    complete: function(){},
    delay: 10
  };

  var async_iterator = function(iteration, complete){
    var delay = 10;
    var hold = false;
    
    var async_iteration = function(){
      if(hold){
        return;
      }
      if(iteration()){
        current_iteration = setTimeout(async_iteration, delay);
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
    var working_array = [],
      length = 0,
      results_array = [],
      current_iteration = null,
      next_worker = null;

    var iteration = function(){
      if(0 < length){
        results_array.push(params.iterator(working_array.shift()));
        length --;
        return true;
      }else{
        return false;
      }
    };

    var complete = function(){
      params.complete(results_array);
      if(next_worker !== null){
        next_worker.start(results_array);
      }
    };

    var iterator = async_iterator(iteration, complete);

    var worker = {
      params: _.extend({}, default_params, params),
      start: function(array){
        if(!params.data){
          params.data = array;
        }
        working_array = [].concat(params.data);
        length = working_array.length;
        results_array = [];
        iterator.start();
      },
      stop: function(){
        iterator.stop();
      },
      current_results: function(){
        return [].concat(results_array);
      },
      then: function(next_params){
        var params = _.extend({}, next_params, {hold: true});
        return async_worker(params);
      }
    };

    if(!params.hold){
      worker.start();
    }
    return worker;
  };

  NANO.AsyncWorker = async_worker;
});