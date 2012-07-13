NANO("api.gates", function(NANO){
  var gates_list = {};
  return {
    update: function(new_gates){
      gates_list = {};
      _.each(new_gates, function(gate){
        gates_list[gate.id] = gate;
      });
    },
    get: function(gate_id){
      return gates_list[gate_id];
    }
  };
});