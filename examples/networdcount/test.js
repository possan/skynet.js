var Skynet = require('../../lib/skynet.js').Skynet;

/*
var filereader = require('../workers/filereader');
var linesplitter = require('../workers/linesplitter');
var curl = require('../workers/curl');
var htmlparser = require('../workers/htmlparser');
var htmltextextractor = require('../workers/htmltextextractor');
var wordSplitter = require('../workers/wordsplitter');
var wordCombiner = require('../workers/wordCombiner');
var saveToDisk = require('../workers/saveToDisk');
var newspapers = require('./worker/newspapers');

var environment = Sky.environment('local');


function extractTextOnWebpage() {
	return Skynet.pipeline()

		//
		// curl node
		//
		// input:
		// { url: 'http://...' }
		//
		// output:
		// { url: 'http://...', html: '<html>...</html>' }
		//
		.pipe( curl({}) )

		//
		// html/dom parser node
		//
		// input:
		// { url: 'http://...', html: '<html>...</html>' }
		//
		// output:
		// { url: 'http://...', dom: { 'html': {} } '}
		//
		.pipe( domparser({}) )

		//
		// text extractor node
		//
		// input:
		// { url: 'http://...', dom: { 'html': {} } '}
		//
		// output:
		// { text: 'hej hopp' }
		// { text: 'b' }
		// { text: 'c' }
		//
		.pipe( htmltextextractor({ tags: ['p'] }) )

		;
}

function singleNewspaperPipeline() {
	return Skynet.pipeline()

		//
		// curl node
		//
		// input:
		// { url: 'http://...' }
		//
		// output:
		// { text: 'hej hopp' }
		// { text: 'b' }
		// { text: 'c' }
		//
		.pipe( extractTextOnWebpage() )

		//
		// input:
		// { text: 'hej hopp' }
		//
		// output:
		// { word: 'hej' }
		// { word: 'hopp' }
		//
		.pipe( wordsplitter({ separators: ['', '\t', '\n', '\r'] }) )

		;
}
*/

var webpagewordcounter = Skynet.pipeline()

	//
	// Initial events
	//
	.from('source')

	//
	// Spawn one pipeline per input
	//
	.parallel([
		'parallel1',
		'parallel2',
		'parallel3',
		Skynet.pipeline()
			.pipe('sub pipeline 1')
			.pipe('sub pipeline 2')
			.parallel([
				'nestedparallel1',
				'nestedparallel2',
				'nestedparallel3',
			])
			.pipe('sub pipeline combiner'),
		'parallel4',
	])

	//
	// Combine results
	//
	.pipe('outercombiner')

	//
	// Save it to disk
	//
	.pipe('finalstep')

	;

Skynet.run(webpagewordcounter, 'environment', function() {
	console.log('all done');
});

Skynet.run(webpagewordcounter, 'environment', function() {
	console.log('all done');
});

Skynet.run(webpagewordcounter, 'environment', function() {
	console.log('all done');
});

// Skynet.run('x', 'y');


