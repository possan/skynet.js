var util = require('util');
var Sky = require('./sky');
var uuid = require('uuid');

console.log('Sky', Sky);

function Worker(sky, name) {
  Sky.Stream.call(this, {});
  this.sky = sky;
  this.id = uuid.v1(),
  this.state = {
    name: name || 'unnamed worker',
    created: new Date()
  };
  // this.once('data', this.ping);
  this.input = new Sky.Stream();
  this.output = new Sky.Stream();
  // Worker.prototype.control = new Sky.Stream();
  var _this = this;
  this.input.on('data', function(item) {
    console.log('in data for ' + _this.id, item);
    if (item.__control == 'PING') _this.ping(item);
    if (_this.process) _this.process(item);
  });
  this.process = null;
  return this;
}

util.inherits(Worker, Sky.Stream);


Worker.prototype.ping = function(item) {
  item.__chain = (item.__chain || []);
  item.__chain.push(this.id);
  this.output.write(item);
}

// abstract, override
Worker.prototype.connect = function(control){
  // environment setup..
  this.emit(control);
}

Worker.prototype.pipe = function(target) {
  this.output.pipe(target.input);
  /*
  this.super_.pipe(target);
  console.log('piping from', this, target);
  //  this.emit(item);
  */
  return target;
}

Worker.prototype.emit = function(item) {
  console.log('we should emit', item);
//  this.emit(item);
  this.input.write(item);
}

module.exports = Worker;