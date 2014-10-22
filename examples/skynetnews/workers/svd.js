var Sky = require('../../lib/sky');
var worker = module.exports = Sky.worker();

worker.process = function(){
  setInterval(function(){
    worker.emit({
      title: 'foo bar',
      source: 'SvD',
      link: 'http://skynet.js'
    });
  }, 200);
}

module.exports = worker;
