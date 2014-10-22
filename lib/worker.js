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
  this.process_control = null;
  // this.once('data', this.ping);
  this.control_input = new Sky.Stream();
  this.control_output = new Sky.Stream();
  // this.data_output = new Sky.Stream();
  // Worker.prototype.control = new Sky.Stream();
  var _this = this;
  this.control_input.on('data', function(item) {
    // console.log('in data for ' + _this.id, item);
    if (item.__control == 'PING') _this.ping(item);
    if (item.__control == 'CONNECT') _this.connect(item);
    if (_this.process_control) _this.process_control(item);
    if (_this.process) _this.process(item);
  });
  return this;
}

util.inherits(Worker, Sky.Stream);


Worker.prototype.ping = function(item) {
  item.__chain = (item.__chain || []);
  item.__chain.push(this.id);
  this.control_output.write(item);
}

Worker.prototype.connect = function(control) {
  var out = this.env.createOutput();
  this.data_output = out;

  if (control.url) {
    console.log('connecting from ' + control.url + ' (#' + control.id + ') to #' + this.id);
    this.data_input = this.env.connectInput(control.url);

    this.data_input.on('data', function(item) {
      if (_this.process) _this.process(item);
    });
  }

  this.url = out.url;
  var response = {
    __control: 'CONNECT',
    id: this.id,
    url: this.url
  }
  this.control_output.write(response);
}

Worker.prototype.pipe = function(target) {
  this.control_output.pipe(target.control_input);
  return target;
}

Worker.prototype.emit = function(item) {
  this.control_output.write(item);
}

Worker.prototype.on = function(type, callback) {
  if (this.control_output) this.control_output.on(type, callback);
}

Worker.prototype.write = function(data) {
  if (this.control_input) this.control_input.write(data);
}

module.exports = Worker;
