var stream = require('stream');
var util = require('util');

function Stream() {
  stream.PassThrough.call(this, { objectMode: true });
  return this;
}

util.inherits(Stream, stream.PassThrough);

var Sky = {
  Stream: Stream,
  stream: function() { return new Stream(); },
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
  /*
  worker : function(name) {
    var worker = new Worker(name);
    // first data expects to be a ping
    worker.once('data', worker.ping);
    worker.on('data', function(item){
      if (worker.process) worker.process(item);
    });
  }
  */
  start: function(pipeline, environment){
    var pipes = pipeline.write({__control: {command: 'PING'}});
    pipes.once('data', function(result){
      console.log('route', route);
      var route = result.__control.route;
      console.log('route', route);
      environment.initialize();
    });
  },
};

console.log('Sky1', Sky);

module.exports = Sky;
