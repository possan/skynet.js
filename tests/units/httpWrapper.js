var chai = require('chai');
var Worker = require('../../lib/worker');
var Wrapper = require('../../lib/wrappers/memory');
var expect = chai.expect;
var request = require('request');

describe('memory wrapper', function () {
  var worker1;
  var wrapper;

  beforeEach(function () {
    worker1 = new Worker();
  });

  it('creates web servers', function (done) {
    wrapper = new Wrapper(worker1).start(function(err, config){
      expect(err).to.not.exist;
      expect(config).to.exist;
      expect(config).to.have.property('data_url');
      expect(config).to.have.property('console_url');
      wrapper.output.on('data', function(data){
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
    });

    it('data web server is alive', function (done) {
      wrapper.start(function(err, config){
        request.get(config.data_url)
        .on('socket', function(socket){
          expect(socket, 'socket').to.exist;
          expect(socket.destroyed, 'destroyed').to.be.false;
          done();
        });
      });
    });

    it('console web server is alive', function (done) {
      wrapper.start(function(err, config){
        request.get(config.console_url)
        .on('socket', function(socket){
          expect(socket, 'socket').to.exist;
          expect(socket.destroyed, 'destroyed').to.be.false;
          done();
        });
      });
    });

    it('pipes worker output to web server', function (done) {
      wrapper.start(function(err, config){
        request.get(config.data_url)
        .on('data', function(data){
          expect(data).to.eql('data');
          done();
        });
        wrapper.input.write('foo');
      });
    });

    it('pipes console commands', function (done) {
      wrapper.id = 'foo';
      wrapper.start(function(err, config){
        request.get(config.data_url)
        .on('data', function(data){
          expect(data).to.eql('foo: done!');
          done();
        });
        wrapper.console.write('done!');
      });
    });

    xit('handles connect command', function (done) {
      
    });
  });


});

