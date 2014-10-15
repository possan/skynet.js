var Sky = require('../lib/sky.js');

module.exports = function(){
  var worker = Sky.worker();

  var aggregate = [];

  worker.input.on('data', function(item) {
    aggregate.push(item.field);
  }

  var flush = function() {
    worker.output.emit(aggregate.length);
    aggregate = [];
  }

  setInterval(flush, 1000);

  worker.on('destroy', function(item) {
    flush();
  }

  return worker;
}
