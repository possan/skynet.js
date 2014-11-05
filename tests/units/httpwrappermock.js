var chai = require('chai');
var Environment = require('../../lib/environment');
var Sky = require('../../lib/sky');
var Worker = require('../../lib/worker');
var HttpWrapper = require('../../lib/httpwrapper');
var request = require('request');

var stream = require('stream');
var expect = chai.expect;

describe('environment', function () {

  var env;
  var worker1;

  beforeEach(function() {
    env = new Environment();
    worker1 = new Worker('worker1', env);
  });

  describe('a spawned worker', function() {

    it('should send worker output data over http data port', function(done) {
      var wrapper = new HttpWrapper(worker1);
      wrapper.start(function(err, config) {
        console.log('got config', config);
        var first = true;
        request.get({json: true, uri: config.data_url})
          .on('socket', function() {
            console.log('connected to ' + config.data_url);
          })
          .on('data', function(data) {
            var item = JSON.parse(data);
            console.log('got data', item);
            if (first) {
              console.log('send data on output pipe');
              worker1.output.write({ __test: 'XXX' });
              first = false;
            } else {
              expect(item, 'data').to.exist;
              expect(item.__test, 'control').to.eql('XXX');
              done();
            }
          });
      });
    });
  });
});