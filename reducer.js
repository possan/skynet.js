// var S = require('skynet')
(function(exports) {

	var stream = require('stream');
	var util = require('util');

	var Worker = function(opts) {
		var keyfield = opts.keyfield || 'text';
		var countfield = opts.countfield || 'count';

		stream.Transform.call(this, { objectMode: true });
		var _this = this;

		var counts = {};

		var _innerFlush = function() {
			Object.keys(counts).forEach(function(k) {
				var out = {};
				out[keyfield] = k;
				out[countfield] = counts[k];
				_this.push(out);
			});
			counts = {};
		}

		var timer;
		var _queueFlush = function() {
			clearTimeout(timer);
			timer = setTimeout(function() {
				_innerFlush();
			}, 100);
		}

		/*
		this._flush = function() {
			clearTimeout(timer);
			_innerFlush();
		}
		*/

		this._transform = function(event, encoding, callback) {
			console.log('Worker: got data', event);

			if (typeof(counts[event[keyfield]]) == 'undefined') {
				counts[event[keyfield]] = 0;
			}
			counts[event[keyfield]] += event[countfield];

			_queueFlush();
			callback();
		}
	}

	util.inherits(Worker, stream.Transform);

	exports.Worker = Worker;

})(exports || window);








