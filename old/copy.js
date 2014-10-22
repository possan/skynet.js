// var S = require('skynet')
(function(exports) {

	var Worker = function(input, ctrl, output) {
		this.input = input;
		this.output = output;
		this.ctrl = ctrl;
		var _this;
		_this = this;
		this.input.on('data', function(event) {
			console.log('got data', event);
			_this.process(event);
		});
	}

	Worker.prototype.process = function(event) {
		console.log('in process', event);
		this.output.emit('processed ' + event);
	}

	exports.Worker = Worker;

})(exports || window);








