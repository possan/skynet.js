// var S = require('skynet')

var Emitter = function(in, ctrl, out) {
	this.in = in;
	this.out = out;
	this.ctrl = ctrl;
	var _this;
	_this = this;
	this.in.addEventListener('data', function(event) {
		_this.process(event);
	});
}

Emitter.prototype.process = function(event) {
	out.emit(event);
}










