# Fidelity

A simple promises-aplus implementation. Faster than `Q`, slower than `Bluebird`.
Simpler and smaller than both.

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

## Testing

This module passes all of the tests in the 
[Promises/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests).
To run the full suite of the Promises/A+ spec, just `npm test` from the command line.
