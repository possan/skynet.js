var Sky = require('../../lib/sky');
var worker = module.exports = Sky.worker();
var request = require('request');
var cheerio = require('cheerio');

worker.start = function(){
  request('http://aftonbladet.se', function(err, body, data){
    var $ = cheerio.load(data);
    $('a.title').each(function(){
      worker.emit({
        text: $(this).text(),
        link: $(this).attr('href')
      });
    })
  });
}
