var Sky = require('../../lib/sky');
var environment = Sky.env('local');

var aftonbladet = require('./workers/aftonbladet');
var svd = require('./workers/svd');
var linkCounter = require('./workers/linkCounter');
var logger = require('./workers/logger');

var pipeline = Sky.parallel([aftonbladet, svd])
  .pipe(linkCounter)
  .pipe(logger);

Sky.start(pipeline, environment);
