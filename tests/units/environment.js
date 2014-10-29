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

      env.spawn(worker, function(err, worker){
        expect(worker.control_input).to.exist;
        expect(worker.control_output).to.exist;

        expect(worker.input).to.not.eql(oldInput);
        expect(worker.output).to.not.eql(oldOutput);
        expect(worker.control_input).to.eql(oldInput);
        expect(worker.control_output).to.eql(oldOutput);

      });
    });
  });

  describe('respawn', function () {
    
  });

  describe('scale', function () {
    
  });
});