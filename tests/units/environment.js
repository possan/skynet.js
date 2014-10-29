var chai = require('chai');
var Environment = require('../../lib/environment');
var Sky = require('../../lib/sky');
var Worker = require('../../lib/worker');

var stream = require('stream');
var expect = chai.expect;

describe('environment', function () {

  var env;
  var worker;

  beforeEach(function() {
    env = new Environment();
    worker = new Worker('worker1', env);
  });

  describe('spawn', function() {
    it('can wireup streams correctly', function (done) {
      var oldInput = worker.input;
      var oldOutput = worker.output;

      expect(worker.control_input).to.not.exist;
      expect(worker.control_output).to.not.exist;

      env.spawn(worker, {}, function(err, worker2) {

        // expect(worker2.input).to.not.equal(oldInput);
        // expect(worker2.output).to.not.equal(oldOutput);

        // expect(worker2.control_input).to.exist;
        // expect(worker.control_output).to.exist;

        // expect(worker.control_input).to.eql(oldInput);
        // expect(worker.control_output).to.eql(oldOutput);
        done();
      });
    });
  });

  describe('respawn', function () {
    
  });

  describe('scale', function () {
    
  });
});