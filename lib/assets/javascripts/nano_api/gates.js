NANO.plugin(function(NANO){
  var gates_list = {};
  var gates = NANO.gates = {
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