var chai = require('chai');
var Sky = require('../../lib/sky');
var Environment = require('../../lib/environment');
var Worker = require('../../lib/worker');
var stream = require('stream');
var expect = chai.expect;

describe('pipeline', function () {

  var env;
  var worker1;
  var worker2;
  var worker3;
  var pipeline;

  beforeEach(function() {
    env = new Environment();
    worker1 = new Worker('worker1', env);
    worker2 = new Worker('worker2', env);
    worker3 = new Worker('worker3', env);
  });

  describe('ping', function() {
    it('gets ping', function(done) {
      pipeline = worker1.pipe(worker2).pipe(worker3);
      pipeline.process_control = function(item) {
        // console.log('end of pipeline', item);
        expect(item).to.exist;
        done();
      }
      worker1.write({ __control: 'PING' });
    });

    it('gets complete route', function(done) {
      pipeline = worker1.pipe(worker2).pipe(worker3);
      pipeline.process_control = function(item) {
        // console.log('end of pipeline 2', item);
        expect(item).to.exist;
        expect(item.__chain).to.exist;
        expect(item.__chain.length).to.equal(3);
        expect(item.__chain).to.eql([
          worker1.id,
          worker2.id,
          worker3.id]);
        done();
      }
      worker1.write({ __control: 'PING' });
    });
  });

  describe('connect', function () {
    it('a worker should receive a connect command', function(done) {
      worker1.process_control = function(item) {
        // console.log('item handled by worker1', item);
        expect(item).to.exist;
        expect(item.__control).to.equal('CONNECT');
        done();
      }
      worker1.write({ __control: 'CONNECT' });
    });
  });

  describe('disconnect', function () {
    
  });

  describe('ready', function () {
    
  });

  describe('worker data flow', function () {

    it('one worker processes data', function(done) {
      worker1.process = function(item) {
        item.apa = 234;
        worker1.emit(item);
      }

      worker1.on('data', function(item) {
        console.log('worker1 got data', item);
        expect(item).to.exist;
        expect(item.test).to.exist;
        expect(item.test).to.eql(123);
        expect(item.apa).to.exist;
        expect(item.apa).to.eql(234);
        done();
      });

      worker1.write({ test: 123 });
    });
  });

  describe('start', function () {
    
  });

  describe('error', function () {
    
  });

  describe('log', function () {
    
  });

});