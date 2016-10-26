# [![Promises/A+](https://promisesaplus.com/assets/logo-small.png)](https://promisesaplus.com) Fidelity

[![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/fidelity/badge.svg?branch=master)](https://coveralls.io/github/bucharest-gold/fidelity?branch=master)
[![Build Status](https://travis-ci.org/bucharest-gold/fidelity.svg?branch=master)](https://travis-ci.org/bucharest-gold/fidelity)
[![Known Vulnerabilities](https://snyk.io/test/npm/fidelity/badge.svg)](https://snyk.io/test/npm/fidelity)
[![dependencies Status](https://david-dm.org/bucharest-gold/fidelity/status.svg)](https://david-dm.org/bucharest-gold/fidelity)

[![NPM](https://nodei.co/npm/fidelity.png)](https://npmjs.org/package/fidelity)

A fast and simple Promise/A+ implementation capable of Node.js or browser-based
execution. `Fidelity` adheres to both the Promise/A+ specspecification, and the
ES6 `Promise` API in its entirety.

|                 | Project Info  |
| --------------- | ------------- |
| License:        | MIT  |
| Build:          | make  |
| Documentation:  | http://bucharest-gold.github.io/fidelity/  |
| Issue tracker:  | https://github.com/bucharest-gold/fidelity/issues  |
| Engines:        | Node.js 4.x, 5.x, 6.x

## Installation

Fidelity can be used in Node.js.

````shell
$ npm install fidelity
````

Or in the browser.

````html
<!-- load fidelity -->
<script src="fidelity-promise-min.js"></script>
````

When used in the browser, a `FidelityPromise` object is created in the
`global` scope.

## Usage

A fidelity promise behaves according to the
[Promises/A+ specification](https://promisesaplus.com/). If you haven't read it,
it's worth your time and will probably make all of the fidelity documentation clearer.

You can create promises using the exported constructor.

    const Fidelity = require('fidelity');
    new Fidelity( (resolve, reject) => {
      // etc.
    } )

You call the constructor function with an executor function as the only parameter. Typically this
function will perform some asynchronous task, and when that task has completed it will
resolve or reject the promise depending on whether or not the task completed successfully.

The executor function takes two function parameters: `resolve` and `reject`. These functions are
used to resolve or reject the promise as needed.

Suppose we have a function, `someAsyncFunction()` that takes some time to complete asynchronously.
We can call this function using a promise.

    const Fidelity = require('fidelity');

    new Fidelity( (resolve, reject) => {
      someAsyncFunction((result, err) => {
        if (err) {
          reject(err); // The function produced an error. Reject the promise
        } else {
          resolve(result); // Fulfill the promise with the result
        }
      });
    })
    .then( (val) => {
      // This code executes after a promise has been fulfilled
      // Do something with the result.
    })
    .catch( (err) => {
      // This code executes if the promise  was rejected
    });

### Promise states

A promise will only ever be in one of three states. `Fidelity.PENDING`,
`Fidelity.FULFILLED` or `Fidelity.REJECTED`.

## API

Generated documentation can be found here: http://bucharest-gold.github.io/fidelity.

### Fidelity

The `fidelity` module exports a constructor function for a Fidelity promise.

    const Fidelity = require('fidelity');

### new Fidelity(func)

A constructor function that creates and returns a promise. The `func` parameter is a function
that accepts a `resolve` and `reject` function.

### Fidelity#then(onFulfilled, onRejected)

The 'then' function takes two function arguments. The first, `onFulfilled`,
is called with the return value (if any) of the promise function if it is
successfully fulfilled. The second function, `onRejected` is called in the
event of an error. A `promise` is returned in either case.

    p.then( (result) => {
      console.log('sucessful result ', result);
    }, (err) => {
      console.error('whoops!', err);
    });

### Fidelity#catch(onRejected)

This is just a little syntactic sugar for `promise.then(null, onRejected);`.
It returns a `promise`.

### Fidelity.resolve(value)

A static utility function that returns a promise which has been resolved
with the provided `value`.

### Fidelity.reject(reason)

A static utility function that returns a promise which has been rejected
with the provided `reason`.

See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject

### Fidelity.all(iterable)

A static utility function which returns a promise that resolves when all
of the promises in the iterable argument have resolved, or rejects with
the reason of the first passed promise that rejects.

See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

### Fidelity.race(iterable)

A static utility function which returns a promise that resolves or rejects as
soon as one of the promises in the iterable resolves or rejects, with the value
or reason from that promise.

See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race

### Fidelity.deferred()

 A static utility function that Creates and returns a `deferred` object.
 Deferred objects contain a promise which may
 be resolved or rejected at some point in the future.

 An example.

    const deferred = Fidelity.deferred();

    callSomeAsyncFunction((err, result) => {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(result);
      }
    });

### Fidelity.deferred().resolve(value)

 Resolves the deferred promise with `value`.

### Fidelity.deferred().reject(cause)

Rejects the deferred promise with `cause`.

### Fidelity.deferred().promise

The deferred promise.

## Testing

This module passes all of the tests in the
[Promises/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests).
To run the full suite of the Promises/A+ spec, just `npm test` from the command line.

## Benchmarks

It's pretty fast. Benchmarks are notoriously
a lot like [statistics](https://en.wikipedia.org/wiki/Lies,_damned_lies,_and_statistics)
so take this with a grain of salt. Results from a simplified, non-scientific benchmark
performed on a Macbook Pro on a random Friday afternoon. Your results may vary.

    ~/s/fidelity git:master ❯❯❯ npm run benchmark                                             ✭ ✱

    > fidelity@4.0.0 benchmark /Users/lanceball/src/fidelity
    > node benchmark/benchmark.js

    PID 48492
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

    new PromiseModule()
    Raw:
    > 2329.3943028485755
    > 2412.2008995502247
    > 2452.446776611694
    > 2293.376311844078
    > 2340.5667166416792
    > 2113.481259370315
    > 2416.1349325337333
    > 2405.9220389805096
    > 2391.76011994003
    > 2410.938530734633
    Average (mean) 2356.6221889055473

    new Fidelity Promise
    Raw:
    > 1871.0824587706147
    > 1871.6251874062968
    > 1865.5232383808095
    > 1839.664167916042
    > 1796.8215892053972
    > 1675.2503748125937
    > 1740.119940029985
    > 1897.5412293853074
    > 1881.6611694152923
    > 1901.6221889055473
    Average (mean) 1834.0911544227888

    new Bluebird Promise
    Raw:
    > 1632.1019490254873
    > 1551.352323838081
    > 1595.5382308845578
    > 1578.6686656671664
    > 1454.9025487256372
    > 1525.3313343328336
    > 1560.8305847076463
    > 1597.0914542728635
    > 1604.014992503748
    > 1622.920539730135
    Average (mean) 1572.2752623688157

    new native Promise
    Raw:
    > 1212.9355322338831
    > 1245.9130434782608
    > 1228.9895052473762
    > 1222.1799100449775
    > 1224.9655172413793
    > 1092.1379310344828
    > 1216.5247376311845
    > 1252.335832083958
    > 1256.0899550224888
    > 1268.6986506746628
    Average (mean) 1222.0770614692656

    new QPromise
    Raw:
    > 346.02998500749624
    > 344.01799100449773
    > 349.18440779610194
    > 350.70764617691157
    > 342.23306772908364
    > 315.39130434782606
    > 346.0569715142429
    > 354.5691462805791
    > 360.11094452773614
    > 350.7316341829085
    Average (mean) 345.9033098567384

    Winner: new PromiseModule()
    Compared with next highest (new Fidelity Promise), it's:
    22.17% faster
    1.28 times as fast
    0.11 order(s) of magnitude faster
    A LITTLE FASTER

    Compared with the slowest (new QPromise), it's:
    85.32% faster
    6.81 times as fast
    0.83 order(s) of magnitude faster

## Contributing

We encourage community contributions! Please read the
[contributing guide](./CONTRIBUTING.md) if you would like to contribute to
this project.
