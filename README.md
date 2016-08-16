# [![Promises/A+](https://promisesaplus.com/assets/logo-small.png)](https://promisesaplus.com) Fidelity

[![Build Status](https://travis-ci.org/lance/fidelity.svg?branch=master)](https://travis-ci.org/lance/fidelity)

A simple promises-aplus implementation.

## Installing

`npm install fidelity`

## API Documentation

The API is pretty simple, and it's lightly documented [here](http://lanceball.com/fidelity/).

## Usage

A fidelity `promise` takes a function as an argument. This function accepts
`resolve` and `reject` functions. Suppose we have a function `f()` that takes
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

### promise.then(onFulfilled, onRejected)

The promise object returned from `promise()` has a function, `then()`. This
takes two function arguments. The first, `onFulfilled`, is called with the return
value (if any) of the promise function if it is successfully fulfilled. The
second function, `onRejected` is called in the event of an error. A `promise`
is returned in either case.

    p.then( (result) => {
      console.log('sucessful result ', result);
    }, (err) => {
      console.error('whoops!', err);
    });

### promise.catch(onRejected)

This is just a little syntactic sugar for `promise.then(null, onRejected);`.
It returns a `promise`.

## Benchmarks

It's pretty fast. Benchmarks are notoriously
a lot like [statistics](https://en.wikipedia.org/wiki/Lies,_damned_lies,_and_statistics)
so take this with a grain of salt. Results from a simplified, non-scientific benchmark
performed on a Macbook Pro on a random Tuesday afternoon. Your results may vary.

    ~/s/fidelity git:master ❮❮❮ npm run benchmark                                         ⏎ ⬆ ✭ ✱

    > fidelity@3.0.1 benchmark /Users/lanceball/src/fidelity
    > node benchmark/benchmark.js

    benchmarking /Users/lanceball/src/fidelity/benchmark/benchmark.js
    Please be patient.
    { http_parser: '2.7.0',
      node: '6.4.0',
      v8: '5.0.71.60',
      uv: '1.9.1',
      zlib: '1.2.8',
      ares: '1.10.1-DEV',
      icu: '57.1',
      modules: '48',
      openssl: '1.0.2h' }
    Scores: (bigger is better)

    PromiseModule.resolve
    Raw:
    > 1555.3626373626373
    > 1401.2167832167831
    > 1327.6563436563436
    > 1393.0969030969031
    Average (mean) 1419.3331668331666

    new PromiseModule()
    Raw:
    > 1365.4745254745255
    > 1343.7552447552448
    > 1191.027972027972
    > 1181.5374625374625
    Average (mean) 1270.4488011988012

    Fidelity.resolve
    Raw:
    > 933.9120879120879
    > 896.8631368631369
    > 870.8951048951049
    > 922.7932067932068
    Average (mean) 906.1158841158842

    Fidelity.promise
    Raw:
    > 785.4055944055945
    > 777.1188811188811
    > 712.4645354645355
    > 734.8341658341658
    Average (mean) 752.4557942057943

    native Promise.resolve
    Raw:
    > 420.1108891108891
    > 426.6373626373626
    > 403.24175824175825
    > 405.8771228771229
    Average (mean) 413.96678321678326

    Bluebird.resolve
    Raw:
    > 441.4175824175824
    > 401.4165834165834
    > 399.82917082917083
    > 410.04495504495503
    Average (mean) 413.1770729270729

    new Promise()
    Raw:
    > 396.83116883116884
    > 374.0979020979021
    > 368.3986013986014
    > 397.9230769230769
    Average (mean) 384.3126873126873

    Q()
    Raw:
    > 145.3106893106893
    > 141.88645418326692
    > 138.93106893106892
    > 137.1878121878122
    Average (mean) 140.82900615320932

    Winner: PromiseModule.resolve
    Compared with next highest (new PromiseModule()), it's:
    10.49% faster
    1.12 times as fast
    0.05 order(s) of magnitude faster
    A LITTLE FASTER

    Compared with the slowest (Q()), it's:
    90.08% faster
    10.08 times as fast
    1 order(s) of magnitude faster

## Testing

This module passes all of the tests in the
[Promises/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests).
To run the full suite of the Promises/A+ spec, just `npm test` from the command line.
