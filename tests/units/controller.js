var chai = require('chai');
var Sky = require('../../lib/sky');
var expect = chai.expect;

describe('pipeline', function () {

  var env;
  var worker1;
  var worker2;
  var worker3;
  var pipeline;

  beforeEach(function () {
    env = Sky.env('local');
    worker1 = new Sky.Worker('worker1');
    worker2 = new Sky.Worker('worker2');
    worker3 = new Sky.Worker('worker3');
    pipeline = worker1.pipe(worker2).pipe(worker3);
  });
  
  describe('ping', function (done) {
    worker1.emit({__control: 'PING'});
    pipeline.process(function(item){
      expect(item).to.exist;
      expect(item.chain).to.exist;
      done();
    })
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