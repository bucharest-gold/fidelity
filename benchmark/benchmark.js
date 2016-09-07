'use strict';

/**
 * These are the packages we are testing against
 */
const Fidelity = require('../lib/index.js');
const Bluebird = require('bluebird');
const PromiseModule = require('promise');
const Q = require('q');

const someWork = (resolve) => {
  setImmediate(() => resolve(Math.floor(Math.random() * (10 - 0))));
};

function runBenchmarks () {
  exports.compare = {
    'new Fidelity Promise': function (done) {
      new Fidelity(someWork).then(done);
    },
    'new native Promise': function (done) {
      new Promise(someWork).then(done);
    },
    'new Bluebird Promise': function (done) {
      new Bluebird(someWork).then(done);
    },
    'new QPromise': function (done) {
      new Q.promise(someWork).then(done);
    },
    'new PromiseModule()': function (done) {
      new PromiseModule(someWork).then(done);
    }
  };

  exports.time = 2000;
  exports.countPerLap = 6;
  exports.compareCount = 10;
  require('bench').runMain();
}

runBenchmarks();
