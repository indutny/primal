'use strict';

var assert = require('assert');
var BN = require('bn.js');
var primal = require('../');

describe('Primal', function() {
  it('should perform primality checks', function() {
    var p = new BN(
        'd80987bb83ac80914a88b5590950127020d09ee68c0895df0298b551e9f431fb', 16);

    assert(primal.create().test(p, 64));

    var p = new BN(
        'd80987bb83a480914a88b5590950127020d09ee68c0895df0298b551e9f431fb', 16);

    assert(!primal.create().test(p, 64));
  });
});
