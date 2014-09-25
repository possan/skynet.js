
var TwitterStream = S.proxy('http://github.com/possan/CopyWorker');
var WordSplitter = S.proxy('CopyWorker');
var WordCounter = S.proxy('CopyWorker');
var Emailer = S.proxy('CopyWorker');

var wordsplitter = S.finiteLinearJob({
	new WordSplitter({ whitespace: ' \t\n' }).pipe()).pipe()..
})

var wordcounters = new S.RemoteContext([
	new Parallel([
		new WordSplitter({ whitespace: ' \t\n' }),
		new WordSplitter({ whitespace: ' \t\n' }),
		new WordSplitter({ whitespace: ' \t\n' }),
		new WordSplitter({ whitespace: ' \t\n' }),
		new WordSplitter({ whitespace: ' \t\n' })
	])
);

var CustomContext = function(childtype) {

	this.childtype = childtype;

	this.on('pipe', function(pipe) {

		this.url = pipe.url;

		// spawna nya maskiner

		this.push({ id: pipe.id, event: 'worker-available', host: 'localhost', port: 'x' });

		//

		this.push({ id: pipe.id, event: 'worker-disconnected', host: 'localhost', port: 'x' });

		//

		this.push({ id: pipe.id, event: 'worker-error', host: 'localhost', port: 'x' });
	});
}

eventstream://248924789243978243789

var job = new S.LocalContext(
	TwitterStream.pipe(wordcounters).
	.pipe(new AutoScalingStrategy(
		new WordSplitter
	))
	.pipe(new CustomContext())
	.pipe(
		new WordCounter({ asdfads })).pipe( new Emailer("spam@somewhere.com"))
	);

job.start();
