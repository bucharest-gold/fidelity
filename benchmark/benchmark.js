'use strict';

const Fidelity = require('../lib/index.js');
const Bluebird = require('bluebird');
const PromiseModule = require('promise');
const Q = require('q');

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function newNativePromise () {
  return new Promise((resolve, reject) => {
    resolve(getRandomInt(0, 10));
  });
}

function nativePromiseResolve () {
  return Promise.resolve(getRandomInt(0,10));
}

function fidelityPromise () {
  return Fidelity.resolve(getRandomInt(0,10));
}

function bluebirdPromise () {
  return Bluebird.resolve(getRandomInt(0,10));
}

function QPromise () {
  return Q(getRandomInt(0,10));
}

function PromiseModuleResolve () {
  return PromiseModule.resolve(getRandomInt(0,10));
}

function runBenchmarks () {
  exports.compare = {
    "new Promise()" : function (done) {
      newNativePromise().then(done);
    },
    "Promise.resolve" : function (done) {
      nativePromiseResolve().then(done);
    },
    "Fidelity.resolve" : function(done) {
      fidelityPromise().then(done);
    },
    "Bluebird.resolve" : function (done) {
      bluebirdPromise().then(done);
    },
    "Q()" : function (done) {
      QPromise().then(done);
    },
    "PromiseModule.resolve" : function (done) {
      PromiseModuleResolve().then(done);
    }
  };

  exports.time = 1000;
  require('bench').runMain();
}
runBenchmarks();

