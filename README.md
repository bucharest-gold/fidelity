# [![Promises/A+](https://promisesaplus.com/assets/logo-small.png)](https://promisesaplus.com) Fidelity

[![Build Status](https://travis-ci.org/lance/fidelity.svg?branch=master)](https://travis-ci.org/lance/fidelity)

A simple promises-aplus implementation.

## Installing

`npm install fidelity`

## API Documentation

The API is pretty simple, and it's lightly documented [here](http://lanceball.com/fidelity/).

## Usage

A fidelity `promise` takes a function as an argument. This function accepts a
`resolve` and a `reject` object. Suppose we have a function `f()` that takes
some time to complete asynchronously. We can call this function using a promise.

    var Fidelity = require('fidelity');

    Fidelity.promise( (resolve, reject) => {
      someAsyncFunction((result, err) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }).then( (val) => {
      // Do something with the result.
    });

The promise object returned from `promise()` has a function, `then()`. This
takes two function arguments. The first is called with the return
value (if any) of the promise function if it is successfully fulfilled. The
second function is called in the event of an error.

    p.then( (result) => {
      console.log('sucessful result ', result);
    }, (err) => {
      console.error('whoops!', err);
    });

## Benchmarks

It's pretty fast. Benchmarks are notoriously
a lot like [statistics](https://en.wikipedia.org/wiki/Lies,_damned_lies,_and_statistics)
so take this with a grain of salt. Results from a simplified, non-scientific benchmark
performed on a Macbook Pro on a random Thursday morning.

    ~/s/fidelity git:master ❮❮❮ npm run benchmark                                         ⏎ ⬆ ✭ ✱

    > fidelity@3.0.1 benchmark /Users/lanceball/src/fidelity
    > node benchmark/benchmark.js

    benchmarking /Users/lanceball/src/fidelity/benchmark/benchmark.js
    Please be patient.
    { http_parser: '2.7.0',
      node: '6.2.0',
      v8: '5.0.71.47',
      uv: '1.9.1',
      zlib: '1.2.8',
      ares: '1.10.1-DEV',
      icu: '57.1',
      modules: '48',
      openssl: '1.0.2h' }
    Scores: (bigger is better)

    PromiseModule.resolve
    Raw:
    > 1452.0469530469531
    > 1451.051948051948
    > 1328.9690309690309
    > 1381.3556443556442
    Average (mean) 1403.355894105894

    Fidelity.resolve
    Raw:
    > 480.5814185814186
    > 470.0689310689311
    > 442.5074925074925
    > 518.3576423576424
    Average (mean) 477.87887112887114

    Bluebird.resolve
    Raw:
    > 412.5564435564436
    > 427.02897102897106
    > 401.5834165834166
    > 417.4425574425574
    Average (mean) 414.6528471528472

    native Promise.resolve
    Raw:
    > 426.4095904095904
    > 387.86313686313684
    > 385.55944055944053
    > 440.2147852147852
    Average (mean) 410.01173826173823

    new Promise()
    Raw:
    > 390.84115884115886
    > 373.2167832167832
    > 387.4725274725275
    > 376.1778221778222
    Average (mean) 381.9270729270729

    Q()
    Raw:
    > 142.8181818181818
    > 139.21678321678323
    > 138.32867132867133
    > 142.3116883116883
    Average (mean) 140.66883116883116

    Winner: PromiseModule.resolve
    Compared with next highest (Fidelity.resolve), it's:
    65.95% faster
    2.94 times as fast
    0.47 order(s) of magnitude faster
    QUITE A BIT FASTER

    Compared with the slowest (Q()), it's:
    89.98% faster
    9.98 times as fast
    1 order(s) of magnitude faster

## Testing

This module passes all of the tests in the
[Promises/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests).
To run the full suite of the Promises/A+ spec, just `npm test` from the command line.
