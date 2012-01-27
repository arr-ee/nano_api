NANO.plugin(function(NANO){

  var distanceMatrix = function(){
    this.matrix = {};
  };
  distanceMatrix.prototype = {
    set: function(x, y, value){
      this.matrix[ x + "_" + y ] = value;
    },
    get: function(x, y){
      return this.matrix[ x + "_" + y ];
    }
  };

  NANO.levenstain = {
    operation_price: 1,
    change_price: 1,
    insert_delete_price: 2,
    _change_price: function(a, b){
      var price = 0;
      if((a === "" || b === "") && (a !== b)){
        price = this.insert_delete_price;
      }else{
        price = a === b ? 0 : 1;
      }
      return price;
    },
    calculate: function(string_x, string_y){
      var state = {
        string_x: string_x,
        string_y: string_y,
        distances: new distanceMatrix(),
        stop: false
      };
      return this._calculate_length(state);
    },
    _calculate_distance: function(i, j, state){
      var char_ix = state.string_x.charAt(i - 1);
      var char_jy = state.string_y.charAt(j - 1);
      var change_symbol_price = this._change_price(char_ix, char_jy);
      if(i === 0 && j === 0){
        return state.distances.set(0, 0, 0);
      }
      if(i === 0 && 0 < j){
        return state.distances.set(0, j, j);
      }
      if(j === 0 && 0 < i){
        return state.distances.set(i, 0, i);
      }
        
      var a = state.distances.get(i - 1, j) + 1;
      var b = state.distances.get(i, j - 1) + 1;
      var c = state.distances.get(i - 1, j - 1) + change_symbol_price;

      var value = Math.min(a, b, c);
      return state.distances.set(i, j, value);
    },
    _calculate_length: function(state){
      var i, j,
        x_length = state.string_x.length,
        y_length = state.string_y.length;

      this._calculate_distance(0, 0, state);
      
      j = 1; 
      while(j <= y_length){
        this._calculate_distance(0, j, state);
        j++;
      }
      i = 1;
      while(i <= x_length){
        this._calculate_distance(i, 0, state);
        j = 1;
        while(j <= y_length){
          this._calculate_distance(i, j, state);
          j++;
        }
        i++;
      }
      return state.distances.get(x_length, y_length);
    }
  };
});
