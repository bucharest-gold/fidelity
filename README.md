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
| Engines:        | Node.js 6.x, 8.x

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

## Contributing

We encourage community contributions! Please read the
[contributing guide](./CONTRIBUTING.md) if you would like to contribute to
this project.
