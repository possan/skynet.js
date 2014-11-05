var http = require('http');


function HttpEnvironment()
{

  function startServer(worker, config, done) {
    var server = http.createServer(function (req, res) {
      worker.output.on('data', function(data){
        if (typeof data === 'object') {
          res.write(JSON.stringify(data, null, 2));
        } else{
          res.write(data);
        }
      });
      // worker.input.pipe(res);
    });

    config.port = config.port || (1024 + Math.floor(Math.random()*65536-1024));
    config.host = config.host || '127.0.0.1';
    server.listen(config.port, config.host, function(err){
      done(err, config);
    });
  }

  this.spawn = function(worker, config, done) {
    // var child = worker.clone();
    // 
    return startServer(worker, config, done);
  }

}

module.exports = HttpEnvironment;