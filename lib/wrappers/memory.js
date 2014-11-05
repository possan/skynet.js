var Sky = require('../sky');

module.exports = function(worker, done){
  this.control = new Sky.Stream();
  this.output = new Sky.Stream();

  worker.control.pipe(this.control);
  worker.output.pipe(this.output);

  return done(null, {
    controller_url: null,
    data_url: null
  });
}