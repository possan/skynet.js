var chai = require('chai');
var Sky = require('../../lib/sky');
var Worker = require('../../lib/worker');
var stream = require('stream');
var expect = chai.expect;

console.log('Sky', Sky);

describe('pipeline', function () {

  var env;
  var worker1;
  var worker2;
  var worker3;
  var pipeline;

  beforeEach(function() {
    console.log('be');
    env = Sky.env('local');
    worker1 = new Worker(null, 'worker1');
    worker2 = new Worker(null, 'worker2');
    worker3 = new Worker(null, 'worker3');
    console.log('be2');
    pipeline = worker1.pipe(worker2).pipe(worker3);
    console.log('be3');
  });

  describe('ping', function() {
    it('gets ping', function(done) {
      pipeline.process = function(item) {
        console.log('end of pipeline', item);
        expect(item).to.exist;
        done();
      }
      worker1.emit({ __control: 'PING' });
    });

    it('gets complete route', function(done) {
      pipeline.process = function(item) {
        console.log('end of pipeline 2', item);
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