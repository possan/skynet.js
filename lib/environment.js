var http = require('http');


function HttpEnvironment()
{

  function startServer(worker, config, done) {
    var server = http.createServer(function (req, res) {
      worker.output.pipe(res);
      console.log('CONNECT');
    });
    config.port = config.port || (1024 + Math.floor(Math.random()*1000));
    config.host = config.host || '127.0.0.1';
    server.listen(config.port, config.host, function(err){
      done(err, config);
    });
  }

  this.spawn = function(worker, config, done) {
    var child = worker.clone();
    return startServer(child, config, done);
  }

}

module.exports = HttpEnvironment;