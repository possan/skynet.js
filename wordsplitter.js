// var S = require('skynet')
(function(exports) {

	var stream = require('stream');
	var util = require('util');

	var Worker = function() {
		stream.Transform.call(this, { objectMode: true });
		var _this = this;
		this._transform = function(event, encoding, callback) {
			console.log('Worker: got data', event);

			var words = event.text.split(' ');
			words.forEach(function(word) {
				word = word.trim();
				_this.push({ text: word, count: 1 });
			});
			callback();
		}
	}

	util.inherits(Worker, stream.Transform);

	exports.Worker = Worker;

})(exports || window);








