var Sky = require('../../lib/sky');
var worker = module.exports = Sky.worker();

var urls = {};

worker.process = function(item){
  if (item.link) {
    (urls[item.link] = urls[item.link] || []).push(item);
  }
}