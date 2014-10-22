var Sky = require('../../lib/sky');
var worker = module.exports = Sky.worker();

worker.process = function(item){
  console.log('output', item);
}
