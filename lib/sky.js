var stream = require('stream');
var util = require('util');
var uuid = require('uuid');

function Stream() {
  stream.PassThrough.call(this, { objectMode: true });
  return this;
}

util.inherits(Stream, stream.PassThrough);

var _globalstreams = {};

function createOutput() {
  var id = uuid.v1();
  var output = Sky.stream();
  _globalstreams[id] = output;
  return { url: 'inproc://eventstream-'+id };
}

function connectInput(url) {
  var s = Sky.stream();
  return s;
}

var Sky = {
  Stream: Stream,
  stream: function() { return new Stream(); },
  env : function() {
    return {
      createOutput: createOutput,
      connectInput: connectInput
    }
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

module.exports = Sky;
