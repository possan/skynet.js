var chai = require('chai');
var Sky = require('../../lib/sky');
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
    env = Sky.env('local');
    worker1 = new Worker(null, 'worker1');
    worker2 = new Worker(null, 'worker2');
    worker3 = new Worker(null, 'worker3');
  });

  describe('ping', function() {
    it('gets ping', function(done) {
      pipeline = worker1.pipe(worker2).pipe(worker3);
      pipeline.process = function(item) {
        // console.log('end of pipeline', item);
        expect(item).to.exist;
        done();
      }
      worker1.emit({ __control: 'PING' });
    });

    it('gets complete route', function(done) {
      pipeline = worker1.pipe(worker2).pipe(worker3);
      pipeline.process = function(item) {
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
      worker1.emit({ __control: 'PING' });
    });
  });

  describe('connect', function () {
    it('a worker should receive a connect command', function(done) {
      worker1.process = function(item) {
        // console.log('item handled by worker1', item);
        expect(item).to.exist;
        expect(item.__control).to.equal('CONNECT');
        done();
      }
      worker1.emit({ __control: 'CONNECT' });
    });

    it('a worker should return a url to the next node', function(done) {
      worker1.pipe(worker2);
      worker2.process = function(item) {
        // console.log('worker2 received', item);
        expect(item).to.exist;
        expect(item.id).to.equal(worker1.id);
        expect(item.url).to.exist;
        expect(item.url).to.equal(worker1.url);
        done();
      }
      worker1.emit({ __control: 'CONNECT' });
    });

    it('gets url from all nodes', function(done) {
      pipeline = worker1.pipe(worker2).pipe(worker3);
      pipeline.on('data', function(item) {
        expect(item).to.exist;
        expect(item.id).to.exist;
        expect(item.id).to.eql(worker3.id);
        expect(item.url).to.exist;
        expect(item.url).to.eql(worker3.url);
        done();
      });
      worker1.emit({ __control: 'CONNECT' });
    });
  });

  describe('disconnect', function () {
    
  });

  describe('ready', function () {
    
  });

  describe('start', function () {
    
  });

  describe('error', function () {
    
  });

  describe('log', function () {
    
  });

});