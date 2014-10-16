var stream = require('stream');

var Sky = module.exports = {
  stream: function(){
    return new stream.PassThrough({ objectMode: true });
  },
  env : function(){
    return {}
  },
  parallell : function(array){
    var stream = this;
    var output = Sky.stream();
    array.forEach(function(dest){
      stream.pipe(dest);
      dest.pipe(output);
    });
    return output;
  },
  worker : function(){
    var worker = this;
    worker.on('data', function(item){
      if (worker.process) worker.process(item);
    })
  }
}