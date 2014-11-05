var util = require('util');
var Sky = require('./sky');
var uuid = require('uuid');
var request = require('request');
var http = require('http');

var HttpWrapper = function(worker) {
  this.input = new Sky.Stream();
  this.output = new Sky.Stream();
  this.control = new Sky.Stream();
  this.worker = worker;
  this.control.on('data', this.handleControl.bind(this));
  this.input.pipe(this.worker.input);
  this.worker.output.pipe(this.output);
};

HttpWrapper.prototype.handleControl = function(data) {
  var _this = this;
  if (data.__control && data.__control === 'connect') {
    // connect input to this url
    var url = data.url;
    console.log('connecting to input at ' + url + ' ...');
    request.get({json: true, uri: url})
      .on('socket', function() {
        console.log('connected to ' + url);
        /* setTimeout(function(){ // HACK: when do we know it's ready...
          worker1.write({ __control: 'XXX' });
        }, 10);
        */
      })
      .on('data', function(data) {
        console.log('got data on input', data);
        _this.input.write(data);
      });
  }
}

HttpWrapper.prototype.start = function(callback) {
  // start up worker and return info on control port

  var _this = this;

  var consoleport = (1024 + Math.floor(Math.random()*10000));
  var consolehost = '127.0.0.1';
  var console_url = 'http://' + consolehost + ':' + consoleport;

  var dataport = (1024 + Math.floor(Math.random()*10000));
  var datahost = '127.0.0.1';
  var data_url = 'http://' + datahost + ':' + dataport;

  this.consoleserver = http.createServer(function (req, res) {
    console.log('console connection');
    console.pipe(res);
  });

  this.dataserver = http.createServer(function (req, res) {
    console.log('data connection');
    res.write(JSON.stringify({}));
    _this.output.on('data', function(data) {
      console.log('got data on output pipe', data);
      if (typeof data === 'object') {
        res.write(JSON.stringify(data, null, 2));
      } else{
        res.write(data);
      }
    });
  });

  console.log('starting console server', console_url);
  this.consoleserver.listen(consoleport, consolehost, function(err) {
    console.log('console server up', err);
    if (err) {
      callback(err);
      return;
    }
    console.log('starting data server', data_url);
    _this.dataserver.listen(dataport, datahost, function(err) {
      console.log('data server up', err);
      if (err) {
        // done(err, null);
        callback(err);
        return;
      }

      setTimeout(function() {
        callback(null, {
          data_url: data_url,
          console_url: console_url
        });
      }, 100);
    });
  });

}

module.exports = HttpWrapper;
