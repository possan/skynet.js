var Sky = require('../../lib/sky');
var worker = module.exports = Sky.worker();

worker.start = function(){

  setInterval(function(){
    worker.emit({
      title: 'foo',
      source: 'Aftonbladet',
      link: 'http://skynet.js'
    });
  }, 200);

}
