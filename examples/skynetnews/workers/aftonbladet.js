var Sky = require('../../../lib/sky');
var worker = module.exports = new Sky.worker();

worker.start = function(){

  setInterval(function(){
    worker.emit({
      title: 'foo',
      source: 'Aftonbladet',
      link: 'http://skynet.js'
    });
  }, 200);

}

module.exports = worker;
