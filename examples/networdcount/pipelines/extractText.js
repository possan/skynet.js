var Sky = require('./lib/sky');

var curl = require('../workers/curl');
var htmlparser = require('../workers/htmlparser');
var htmltextextractor = require('../workers/htmltextextractor');

exports.extractTextOnWebpage = function() {
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
