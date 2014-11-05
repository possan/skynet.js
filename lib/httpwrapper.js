var util = require('util');
var Sky = require('./sky');
var uuid = require('uuid');
var request = require('request');
var http = require('http');

var HttpWrapper = function(worker) {
  this.input = new Sky.Stream();
  this.output = new Sky.Stream();
  this.console = new Sky.Stream();
  this.consoleout = new Sky.Stream();
  this.worker = worker;
  this.console.on('data', this.handleControl.bind(this));
  this.input.pipe(this.worker.input);
  this.worker.output.pipe(this.output);
};

HttpWrapper.prototype.handleControl = function(data) {
  var _this = this;
  if (data.__control && data.__control === 'connect') {
    // connect input to this url
    var url = data.url;
    console.log(_this.worker.id+': connecting to input at ' + url + ' ...');
    var first = true;
    request.get({json: true, uri: url})
      .on('socket', function() {
        /* setTimeout(function(){ // HACK: when do we know it's ready...
          worker1.write({ __control: 'XXX' });
        }, 10);
        */
      })
      .on('data', function(data) {
        if (first) {
          console.log(_this.worker.id+': connected to ' + url);
          _this.console.write({
            __control: 'connected',
            from_id: _this.worker.id,
            to_url: url
          });
          first = false;
        } else {
          console.log(_this.worker.id+': got data on input', data);
          _this.input.write(data);
        }
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
    console.log(_this.worker.id+': console connection');
    _this.consoleout.on('data', function(data) {
      console.log(_this.worker.id+': got data on console pipe', data);
      if (typeof data === 'object') {
        res.write(JSON.stringify(data));
      } else{
        res.write(data);
      }
    });
    res.write( _this.worker.id + ': hello!\n');
  });

  this.dataserver = http.createServer(function (req, res) {
    console.log(_this.worker.id+': data connection');
    res.write(JSON.stringify({}));
    _this.console.write({
      __control: 'connected',
      to_id: _this.worker.id
    });
    _this.output.on('data', function(data) {
      console.log(_this.worker.id+': got data on output pipe', data);
      if (typeof data === 'object') {
        res.write(JSON.stringify(data));
      } else{
        res.write(data);
      }
    });
  });

  console.log(_this.worker.id+': starting console server', console_url);
  this.consoleserver.listen(consoleport, consolehost, function(err) {
    console.log(_this.worker.id+': console server up', err);
    if (err) {
      callback(err);
      return;
    }
    console.log(_this.worker.id+': starting data server', data_url);
    _this.dataserver.listen(dataport, datahost, function(err) {
      console.log(_this.worker.id+': data server up', err);
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
