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
	.from('newspapers')

	//
	// Spawn one pipeline per input
	//
	.spawnParallel('singleNewspaperPipeline')

	//
	// Combine results
	//
	.pipe('wordCombiner')

	//
	// Save it to disk
	//
	.pipe('saveReport')

	;

Skynet.run(webpagewordcounter, 'environment');

// Skynet.run('x', 'y');


