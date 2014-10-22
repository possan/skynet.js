// var S = require('skynet')

var Sink = function(in, ctrl, out) {
	this.in = in;
	this.out = out;
	this.ctrl = ctrl;
	var _this;
	_this = this;
	this.in.addEventListener('data', function(event) {
		_this.process(event);
	});
}

Sink.prototype.process = function(event) {
	console.log(event);
}
