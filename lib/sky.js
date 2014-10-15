var stream = require('stream');

module.exports = {
  stream: function(){
    return new stream.PassThrough({ objectMode: true });
  },
  environment : function(){
    return {}
  },
  parallell : function(array){
    var stream = this;
    array.forEach(function(worker){
      stream.pipe(worker);
    });
  }
  worker : function(){

  }
}