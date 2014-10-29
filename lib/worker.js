var util = require('util');
var Sky = require('./sky');
var uuid = require('uuid');

function Worker(name, env) {
  Sky.Stream.call(this, {});
  this.env = env;
  this.id = uuid.v1(),
  this.state = {
    name: name || 'unnamed worker',
    created: new Date()
  };
  this.process = null;
  // this.once('data', this.ping);
  this.input = new Sky.Stream();
  this.output = new Sky.Stream();
  // Worker.prototype.control = new Sky.Stream();
  var _this = this;
  this.input.on('data', function(item) {
    // console.log('in data for ' + _this.id, item);
    if (item.__control == 'PING') _this.ping(item);
    if (item.__control == 'CONNECT') _this.connect(item);
    if (_this.process) _this.process(item);
  });
  return this;
}

util.inherits(Worker, Sky.Stream);


Worker.prototype.ping = function(item) {
  item.__chain = (item.__chain || []);
  item.__chain.push(this.id);
  this.output.write(item);
}

Worker.prototype.connect = function(control, done) {
  this.env.spawn(this, done);
}

Worker.prototype.pipe = function(target) {
  this.output.pipe(target.input);
  return target;
}

Worker.prototype.emit = function(item) {
  this.output.write(item);
}

Worker.prototype.on = function(type, callback) {
  if (this.output) this.output.on(type, callback);
}

Worker.prototype.write = function(data) {
  if (this.input) this.input.write(data);
}

module.exports = Worker;
