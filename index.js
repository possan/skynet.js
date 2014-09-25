
var stream = require('stream');
var util = require('util');
var CopyWorker = require('./copy.js').Worker;
var WordSplitterWorker = require('./wordsplitter.js').Worker;
var ReducerWorker = require('./reducer.js').Worker;
var fs = require('fs');























	// .pipe(new CopyWorker({ append: ' world' }))
	// .pipe(new CopyWorker({ prepend: 'hej ' }))

var in1 = new stream.PassThrough({ objectMode: true });
var in1out = in1.pipe(new WordSplitterWorker())
	.pipe(new ReducerWorker({ keyfield: 'text', countfield: 'count' }))
	.on('data', function(data) {
		console.log('end of in1', data);
	});

var in2 = new stream.PassThrough({ objectMode: true });
var in2out = in2.pipe(new WordSplitterWorker())
	.pipe(new ReducerWorker({ keyfield: 'text', countfield: 'count' }))
	.on('data', function(data) {
		console.log('end of in2', data);
	});

var combiner = new stream.PassThrough({ objectMode: true });
combiner
	.pipe(new ReducerWorker({ keyfield: 'text', countfield: 'count' }))
	.on('data', function(data) {
		console.log('after combine step', data);
	});

in1out.pipe(combiner);
in2out.pipe(combiner);

in1.write({text: 'a b c d e'});
in2.write({text: 'a b c a x y'});

parallel([
	[  ]
	[  ]
]).pipe( combiner );

job.run(function(data) {

});





