var stream = require('stream');
var Worker = require('./worker');

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
  worker : function(name){
    var worker = new Worker(name);
    
    // first data expects to be a ping
    worker.once('data', worker.ping);
    worker.on('data', function(item){
      if (worker.process) worker.process(item);
    });
  },
  start: function(pipeline, environment){
    var pipes = pipeline.write({__control: {command: 'PING'}});
    pipes.once('data', function(result){
      var route = result.__control.route;
      console.log('route', route);
      environment.initialize();
    });
  },
}
