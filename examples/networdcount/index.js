var Sky = require('./lib/sky');

/* WIREUP */

var filereader = require('../workers/filereader');
var linesplitter = require('../workers/linesplitter');
var curl = require('../workers/curl');
var htmlparser = require('../workers/htmlparser');
var htmltextextractor = require('../workers/htmltextextractor');
var wordSplitter = require('../workers/wordsplitter');
var wordCombiner = require('../workers/wordCombiner');
var saveToDisk = require('../workers/saveToDisk');
var newspapers = require('./worker/newspapers');

var extractTextOnWebpage = require('./pipelines/extractText.js').extractTextOnWebpage;

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
		.pipe( wordsplitter({ separators: ['', '\t', '\n', '\r'] }) );
}

var webpagewordcounter = Skynet.pipeline()

	//
	// Initial events
	//
	.from(newspapers)

	//
	// Spawn one pipeline per input
	//
	.spawnParallel(singleNewspaperPipeline)

	//
	// Combine results
	//
	.pipe(wordCombiner())

	//
	// Save it to disk
	//
	.pipe(saveReport());

Skynet.run(webpagewordcounter, environment);
