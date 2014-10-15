var Sky = require('../lib/sky.js');

module.exports = function(){
  var worker = Sky.worker();

  worker.init = function(){
    this.accounts = {};
  }

  worker.process = function(item, done){
    var account;
    if (item.amount) // transaction
    {
      account = worker.accounts[item.from] = worker.accounts[item.from] || {};
      account.transactions = account.transactions || [];
      account.transactions.push(item);
    } else { // account
      account = worker.accounts[item.nr];
      account.name = item.name;
    }
    done();
  }

  worker.flush = function(done){
    return done(null, accounts);
  }

  return worker;
}
