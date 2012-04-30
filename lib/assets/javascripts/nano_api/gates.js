NANO.plugin(function(NANO){
  var gates_list = {};
  var gates = NANO.gates = {
    update: function(new_gates){
      gates_list = $.extend({}, new_gates);
    },
    get: function(gate_id){
      return gates_list[gate_id];
    }
  };
});