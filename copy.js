// var S = require('skynet')
(function(exports) {

	var stream = require('stream');
	var util = require('util');

	var Worker = function(opts) {
		this.options = {
			append: opts.append || '',
			prepend: opts.prepend || ''
		}
		console.log('Worker: init', opts);
		stream.Transform.call(this, { objectMode: true });
		var _this = this;
		this._transform = function(event, encoding, callback) {
			console.log('Worker: got data', event);
			if (_this.options.prepend)
				event.text = _this.options.prepend + event.text;
			if (_this.options.append)
				event.text = event.text + _this.options.append;
			_this.push(event);
			callback();
		}
	}

	util.inherits(Worker, stream.Transform);

	exports.Worker = Worker;

})(exports || window);








