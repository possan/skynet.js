var stream = require('stream');
var util = require('util');
var CopyWorker = require('./copy.js').Worker;
var WordSplitterWorker = require('./wordsplitter.js').Worker;
var ReducerWorker = require('./reducer.js').Worker;
var fs = require('fs');
var Sky = require('./lib/sky');


















var context = {};

context.reducer = function() {
	return new ReducerWorker({ keyfield: 'text', countfield: 'count' });
};

context.pipes = {};

context.pipes.splitter = function() {
	return new WordSplitterWorker({});
}

context.stream = function(){
	return new stream.PassThrough({ objectMode: true });
}

context.pipes.workergroup = function(input) {
	return input.pipe(this.wordsplitter()).pipe(this.reducer());
}

/*
var in1 = context.stream();
var in2 = context.stream();

var in1out = context.workergroup(in1);
var in2out = context.workergroup(in2);
*/
var combiner = context.stream()
	.pipe(context.reducer())
	.on('data', function(data) {
		console.log('after combine step', data);
	});
/*
in1out.pipe(combiner);
in2out.pipe(combiner);

in1.write({text: 'a b c d e'});
in2.write({text: 'a b c a x y'});

*/
/*
var inputs = [
	context.stream(),
	context.stream(),
	context.stream(),
	context.stream()
]

var pipelineoutputs = inputs.map(function(x) { return context.workergroup(x); });


inputs[0].write({text: 'a b c d e'});
inputs[1].write({text: 'a b c a x y'});
inputs[2].write({text: 'a b a x y'});
inputs[3].write({text: 'a c a x y'});

Array.prototype.pipe = function(destination){
var pipelineoutputs = this.map(function(x) { return context.workergroup(x); });

}


inputs.pipe()




*/

[

	{text: 'a b c d e'},
	{text: 'a b c a x y'},
	{text: 'a b a x y'},
	{text: 'a c a x y'}

].forEach(function(x) {

	var inp = context.stream();
	var spl = context.pipes.workergroup();
	inp.pipe(spl);
	spl.pipe(combiner);
	inp.write(x);

});



/* WIREUP */ 

var dropbox = Sky('dropbox');
var flickr = Sky('flickr');
var facebook = Sky('facebook');

Sky.parallel([dropbox,flickr,facebook])
	.pipe(exifExtractor)
	.pipe(Sky.parallel([s3upload, db]))
	.pipe(socketio)
	.run(environment);

/* JOB DEFINITON */

dropbox.process(function(input, done){ 
	return context.stream()
})



var purchaseCombiner = require('./workers/purchaseCombiner');
var commisionReporter = Sky.worker();
var paymentProcessor = Sky.worker();
var receiptMailer = require('./workers/receiptMailer');

var env = Sky.environment();

var purchases = parallel([
		hdfsfile('transactions'), // { from: '123', amount : -1 }
		hdfsfile('accounts') // { nr: '123', name: 'foo bar'}
	])
	.pipe(purchaseCombiner)

var live = (process.env.NODE_ENV === 'PRODUCTION');
purchases.pipe(
	parallel(live ? [
		commisionReporter,
		paymentProcessor,
		receiptMailer
	] : [
		commisionReporter,
		paymentProcessor,
	])
	.start(live ? prodEnv : devEnv)
	.run();



purchaseCombiner.process(function() {
});

