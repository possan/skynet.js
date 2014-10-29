var util = require('util');
var Sky = require('./sky');
var uuid = require('uuid');
var request = require('request');

function Worker(type, env) {
  Sky.Stream.call(this, {});
  this.env = env;
  this.id = uuid.v1();
  this.config = {};
  this.process = null;
  this.process_control = null;
  this.input = new Sky.Stream();
  this.output = new Sky.Stream();
  // Worker.prototype.control = new Sky.Stream();
  var _this = this;
  this.input.on('data', function(item) {
    // console.log('in data for ' + _this.id, item);
    if (item.__control === 'PING') _this.ping(item);
    if (item.__control === 'CONNECT') _this.connect(item);
    if (_this.process_control) _this.process_control(item);
    if (_this.process) _this.process(item);
  });
  return this;
}

util.inherits(Worker, Sky.Stream);

Worker.prototype.clone = function() {
  var c = new Worker(this.type, this.env);
  c.process = this.process;
  c.process_control = this.process_control;
  return c;
}

Worker.prototype.ping = function(item) {
  item.__chain = (item.__chain || []);
  item.__chain.push(this.id);
  this.output.write(item);
}

Worker.prototype.connect = function(control, done) {
  var _this = this;
  this.env.spawn(this, {}, function(err, config) {
    console.log('config', config);
    request.get('http://' + config.host + ':' + config.port).pipe(_this.input);

    // _this.input.pipe(child.input);
    // child.output.pipe(_this.output);
    // if (_this.control_input) _this.control_input.pipe(workerclone.control_input);
    // if (_this.input) _this.input.pipe(workerclone.input);
    // if (workerclone.output) workerclone.output.pipe(_this.output);
    // if (workerclone.control_output) workerclone.control_output.pipe(_this.control_output);
    if (done) done();
  });
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
