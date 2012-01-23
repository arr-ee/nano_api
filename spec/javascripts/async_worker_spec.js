describe("AsyncWorker", function(){
  var numbers, hashes, work_results, is_complete, hash;
  beforeEach(function(){
    numbers = [1, 5, 100];
    work_results = [];
    hashes = [{field: 1}, {field: 10}, {field: "23"}];
    is_complete = false;
    hash = {
      "foo": {value: 10},
      "bar": {value: 20},
      "foofoo": {value: 40},
      "barbar": {value: 50}
    };
  });
  it("simple async array numbers iteration", function(){
    NANO.AsyncWorker({
      data: numbers,
      iterator: function(item){
        return item * 2;
      },
      complete: function(results){
        work_results = results;
      }
    });
    waitsFor(function(){
      return work_results.length !== 0;
    });

    runs(function(){
      expect(work_results).toEqual([2, 10, 200]);
    });
  });
  it("simple async array hashes iteration", function(){
    NANO.AsyncWorker({
      data: hashes,
      iterator: function(item){
        return {
          number: +item.field,
          double_number: +item.field * 2
        };
      },
      complete: function(results){
        work_results = results;
      }
    });
    waitsFor(function(){
      return work_results.length !== 0;
    });

    runs(function(){
      expect(work_results).toContain({
        number: 23,
        double_number: 46
      });
      expect(work_results).toContain({
        number: 10,
        double_number: 20
      });
    });
  });

  it("async chained iteration", function(){
    NANO.AsyncWorker({
      data: hashes,
      iterator: function(item){
        return {
          number: +item.field,
          double_number: +item.field * 2
        };
      }
    }).then({
      iterator: function(item){
        return item.double_number;
      },
      complete: function(results){
        work_results = results;
      }
    });

    waitsFor(function(){
      return work_results.length !== 0;
    });

    runs(function(){
      expect(work_results).toEqual([2, 20, 46]);
    });
  });

  it("async chained iteration with additinal data", function(){
    NANO.AsyncWorker({
      data: hashes,
      iterator: function(item){
        return {
          number: +item.field,
          double_number: +item.field * 2
        };
      }
    }).then({
      data: numbers,
      iterator: function(item){
        return item;
      },
      complete: function(results){
        work_results = results;
      }
    });

    waitsFor(function(){
      return work_results.length !== 0;
    });

    runs(function(){
      expect(work_results).toEqual(numbers);
    });
  });

  it("async hash iteration", function(){
    NANO.AsyncWorker({
      data: hash,
      iterator: function(item, key){
        return {
          length: key.length,
          value: item.value / 2
        };
      },
      complete: function(results){
        work_results = results;
        is_complete = true;
      }
    });

    waitsFor(function(){
      return is_complete;
    });

    runs(function(){
      expect(work_results).toEqual({
        "foo": {
          value: 5,
          length: 3
        },
        "bar": {
          value: 10, 
          length: 3,
        },
        "foofoo": {
          value: 20,
          length: 6,
        },
        "barbar": {
          value: 25,
          length: 6,
        }
      });
    });
  });
});
