'use strict';

const Fidelity = require('../lib/index.js');
const Bluebird = require('bluebird');
const PromiseModule = require('promise');
const Q = require('q');
const profiler = require('v8-profiler');
const fs = require('fs');

let profilerRunning = false;

function toggleProfiling () {
  if (profilerRunning) {
    const profile = profiler.stopProfiling();
    console.log('stopped profiling');
    profile.export()
      .pipe(fs.createWriteStream('./fidelity-' + Date.now() + '.cpuprofile'))
      .once('error', profiler.deleteAllProfiles)
      .once('finish', profiler.deleteAllProfiles);
    profilerRunning = false;
    return;
  }
  profiler.startProfiling();
  profilerRunning = true;
  console.log('started profiling');
}

console.log('PID', process.pid);
process.on('SIGUSR2', toggleProfiling);

function getRandomInt (min, max, callback) {
  setImmediate(() => callback(Math.floor(Math.random() * (max - min)) + min));
}

function newNativePromise () {
  return new Promise((resolve, reject) => getRandomInt(0, 10, resolve));
}

function newFidelityPromise () {
  return new Fidelity((resolve, reject) => getRandomInt(0,10, resolve));
}

function newBluebirdPromise () {
  return new Bluebird((resolve, reject) => getRandomInt(0,10, resolve));
}

function newQPromise () {
  return new Q.promise((resolve, reject) => getRandomInt(0,10, resolve));
}

function newPromiseModulePromise () {
  return new PromiseModule((resolve, reject) => getRandomInt(0,10, resolve));
}

function runBenchmarks () {
  exports.compare = {
    "new native Promise" : function (done) {
      newNativePromise().then(done);
    },
    "new Fidelity Promise" : function(done) {
      newFidelityPromise().then(done);
    },
    "new Bluebird Promise" : function (done) {
      newBluebirdPromise().then(done);
    },
    "new QPromise" : function (done) {
      newQPromise().then(done);
    },
    "new PromiseModule()" : function (done) {
      newPromiseModulePromise().then(done);
    }
  };

  exports.time = 2000;
  exports.countPerLap = 6;
  exports.compareCount = 10;
  require('bench').runMain();
}
runBenchmarks();

