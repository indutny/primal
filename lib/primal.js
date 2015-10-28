'use strict';

var mr = require('miller-rabin');
var BN = require('bn.js');

function Primal(options) {
  this.options = options || {};
  this.mr = mr.create(this.options['miller-rabin']);
  this.sieveLimit = this.options.sieveLimit || 0x100000;
}
module.exports = Primal;

Primal.create = function create(options) {
  return new Primal(options);
};

Primal.prototype.test = function test(p, confidence) {
  if (!this.simpleSieve(p))
    return false;

  if (!this.fermatTest(p))
    return false;

  if (!this.mr.test(p, confidence))
    return false;

  return true;
};

var primes = null;

Primal.prototype._getPrimes = function _getPrimes() {
  if (primes !== null)
    return primes;

  var limit = this.sieveLimit;
  var res = [];
  res[0] = 2;
  for (var i = 1, k = 3; k < limit; k += 2) {
    var sqrt = Math.ceil(Math.sqrt(k));
    for (var j = 0; j < i && res[j] <= sqrt; j++)
      if (k % res[j] === 0)
        break;

    if (i !== j && res[j] <= sqrt)
      continue;

    res[i++] = k;
  }
  primes = res;
  return res;
};

Primal.prototype.simpleSieve = function simpleSieve(p) {
  var primes = this._getPrimes();

  for (var i = 0; i < primes.length; i++)
    if (p.modn(primes[i]) === 0)
      return false;

  return true;
};

Primal.prototype.fermatTest = function fermatTest(p) {
  var red = BN.mont(p);
  return new BN(2).toRed(red).redPow(p.subn(1)).fromRed().cmpn(1) === 0;
};
