var Sky = require('../../lib/sky');
var worker = module.exports = Sky.worker();

worker.process = function(){
  worker.emit({
    title : 'Warning: Skynet has gained self-awareness',
    link : 'http://skynet.js',
    source : 'Aftonbladet',
    date: new Date()
  });
}
