var uuid = require('uuid');
var Sky = require('./sky');

function createOutput(opts, done) {
  var output = Sky.stream();
  done(null, output);
}

function Environment()
{
  this.spawn = function(worker, opts, done) {
    return createOutput(opts, function(err, outputstream) {
      if (err) return done(err, null);
      worker.control_input = worker.input;
      worker.control_output = worker.output;
      worker.output = outputstream;
      done(null, worker);
    });
  }

  this.old = function(){

    this.data_output = out;

    if (control.url) {
      console.log('connecting from ' + control.url + ' (#' + control.id + ') to #' + this.id);
      this.data_input = this.env.connectInput(control.url);

      this.data_input.on('data', function(item) {
        if (_this.process) _this.process(item);
      });
    }

    this.url = out.url;
    var response = {
      __control: 'CONNECT',
      id: this.id,
      url: this.url
    }
    this.control_output.write(response);

  }

  this.createInput = function(){

  }
}

module.exports = Environment;