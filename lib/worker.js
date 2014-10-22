var util = require('util');
var Sky = require('./sky');
var guid = require('guid');

function Worker(name){
  this.state = {
    id: new guid(),
    name: name || 'unnamed worker',
    created: new Date()
  };
}
util.inherits(Worker, Sky.stream);

Worker.prototype.input = new Sky.stream();
Worker.prototype.output = new Sky.stream();
Worker.prototype.control = new Sky.stream();

Worker.prototype.ping = function(item){
  var control = item.__control;
  if (!item || control && control.command === 'PING'){
    control.route = control.route || [];
    this.connect(control);

    item.__control.route.push(this.state.id);
    this.emit(item);
  }
}

// abstract, override
Worker.prototype.connect = function(control){
  // environment setup.. 
  this.emit(control);
}

Worker.prototype.emit = function(item){
  this.output.emit(item);
}

Worker.prototype.process = null;

module.exports = Worker;