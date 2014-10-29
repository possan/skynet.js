var chai = require('chai');
var Environment = require('../../lib/environment');
var Sky = require('../../lib/sky');
var Worker = require('../../lib/worker');

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

  describe('spawn', function() {
    it('can wireup new instance correctly', function (done) {
      var oldInput = worker1.input;
      var oldOutput = worker1.output;
      expect(worker1.control_input).to.not.exist;
      expect(worker1.control_output).to.not.exist;
      env.spawn(worker1, {}, function(err, child) {
        expect(child).to.not.equal(worker1);
        // expect(child.input).to.exist;
        // expect(child.output).to.exist;
        done();
      });
    });

    it('a spawned worker should receive a connect command', function(done) {
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

    it('a worker should receive commands', function(done) {
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