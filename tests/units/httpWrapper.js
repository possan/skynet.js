var chai = require('chai');
var Worker = require('../../lib/worker');
var Wrapper = require('../../lib/httpwrapper');
var expect = chai.expect;
var request = require('request');
var http = require('http');

describe('http wrapper', function () {
  var worker1;
  var worker2;
  var wrapper;
  var wrapper2;

  beforeEach(function () {
    worker1 = new Worker();
    worker2 = new Worker();
    worker1.id = 'worker1';
    worker2.id = 'worker2';
  });

  xit('creates web servers', function (done) {
    wrapper = new Wrapper(worker1).start(function(err, config) {
      expect(err).to.not.exist;
      expect(config).to.exist;
      expect(config).to.have.property('data_url');
      expect(config).to.have.property('console_url');
      wrapper.output.on('data', function(data) {
        expect(data).to.exist;
        expect(data).to.eql({bla:'foo'});
        done();
      })
      worker1.write({bla:'foo'});
    });
  });

  describe('web servers', function () {

    beforeEach(function () {
      wrapper = new Wrapper(worker1);
      wrapper2 = new Wrapper(worker2);
    });

    it('data web server is alive', function (done) {
      wrapper.start(function(err, config) {
        request.get(config.data_url)
        .on('data', function(data) {
          if (typeof(data) == 'object') {
            expect(data, 'data').to.exist;
            done();
          }
        });
      });
    });

    it('console web server is alive', function (done) {
      wrapper.start(function(err, config) {
        request.get(config.console_url)
        .on('data', function(data) {
          if (typeof(data) == 'object') {
            expect(data, 'data').to.exist;
            done();
          }
        });
      });
    });

    it('pipes worker output to web server', function (done) {
      wrapper.start(function(err, config) {
        var first = true;
        request.get(config.data_url)
        .on('data', function(data) {
          data = JSON.parse(data);
          if (first) {
            wrapper.output.write({ foo: 'bar' });
            first = false;
          } else {
            if (data && data.foo == 'bar') {
              done();
            }
          }
        });
      });
    });

    xit('pipes console commands', function (done) {
      wrapper.id = 'foo';
      wrapper.start(function(err, config){
        request.get(config.data_url)
        .on('data', function(data) {
          if (data) {
            expect(data).to.eql('foo: done!');
            done();
          }
        });
        wrapper.console.write('done!');
      });
    });

    it('connects input on connect command', function (done) {
      var testport = (1024 + Math.floor(Math.random()*10000));
      var testhost = '127.0.0.1';
      var test_url = 'http://' + testhost + ':' + testport;
      console.log('test server:', test_url);

      var testserver = http.createServer(function (req, res) {
        console.log('got test server connection');
        done();
      });

      testserver.listen(testport, testhost, function(err) {
        console.log('test server up');
      });

      wrapper.start(function(err, config) {
        var first = true;
        request.get(config.data_url)
        .on('data', function(data) {
          data = JSON.parse(data);
          if (first) {
            wrapper.console.write({
              __control: 'connect',
              url: test_url
            })
            first = false;
          }
        });
      });
    });

    it('gets notified when two workers are connected', function (done) {
      wrapper.start(function(err, config) {
        console.log('wrapper 1 config', config);
        wrapper.console.on('data', function(data) {
          console.log('wrapper1 console', data);
          if (data.__control && data.__control == 'connected') {
            done();
          }
        });
        wrapper2.start(function(err, config2) {
          console.log('wrapper 2 config', config2);
          wrapper2.console.write({
            __control: 'connect',
            url: config.data_url
          });
          wrapper2.console.on('data', function(data) {
            console.log('wrapper2 console', data);
          });
        });
      });
    });
  });


});

