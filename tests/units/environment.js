var chai = require('chai');
var Environment = require('../../lib/environment');
var Sky = require('../../lib/sky');
var Worker = require('../../lib/worker');
var request = require('request');

var stream = require('stream');
var expect = chai.expect;

describe('environment', function () {

  var env;
  var worker1;
  var worker2;
  var worker3;

  beforeEach(function() {
    env = new Environment();
    worker1 = new Worker('worker1', env);
    worker2 = new Worker('worker1', env);
    worker3 = new Worker('worker1', env);
  });

  describe('a spawned worker', function() {
    
    it('should return a valid config', function(done) {
      env.spawn(worker1, {}, function(err, config) {
        expect(config).to.exist;
        expect(config.host, 'host').to.exist;
        expect(config.port, 'port').to.exist;
        done();
      });
    });

    it('should respond on port', function(done) {
      env.spawn(worker1, {}, function(err, config) {
        request.get('http://' + config.host + ':' + config.port)
        .on('socket', function(socket){
          expect(socket, 'socket').to.exist;
          expect(socket.destroyed, 'destroyed').to.be.false;
          done();
        });
      });
    });

    xit('should receive a connect command', function(done) {
      env.spawn(worker1, {}, function(err, child) {
        child.process = function(item) {
          // console.log('item handled by worker1', item);
          expect(item).to.exist;
          expect(item.__control).to.equal('XXX');
          done();
        }
        child.write({ __control: 'XXX' });
      });
    });


    xit('a worker should receive commands', function(done) {
      worker1.pipe(worker2);
      // env.spawn(worker2, {}, function(err, child) {
      worker2.process = function(item) {
        // console.log('item handled by worker1', item);
        // expect(item).to.exist;
        // expect(item.__control).to.equal('XXX');
        done();
      }
      // });
      worker1.write({ __control: 'XXX' });
    });

    xit('gets url from all nodes', function(done) {
      pipeline = worker1.pipe(worker2).pipe(worker3);
      pipeline.on('data', function(item) {
        expect(item).to.exist;
        expect(item.id).to.exist;
        expect(item.id).to.eql(worker3.id);
        // expect(item.url).to.exist;
        // expect(item.url).to.eql(worker3.url);
        done();
      });
      worker1.write({ __control: 'CONNECT' });
    });
  });

  describe('respawn', function () {
    
  });

  describe('scale', function () {
    
  });
});