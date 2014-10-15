var Sky = require('../lib/sky.js');



module.exports = function(){
  var worker = Sky.worker();

  // raw way
  worker.input.on('data', function(item) {
    // send mail
    worker.process(item);
    worker.output.emit(item);
  }


  // object way
  worker.process = function(inputstream, done)  {
    inputstream.on('data', function() {
      // send mail
    });
    done();
  }
  return worker;
}