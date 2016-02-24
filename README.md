# Fidelity

A simple promises-aplus implementation. I wrote this over the course of a few
days with some simple goals in mind.

  - Gain a better understanding of how Promises work
  - Pass all of the tests in the [Promises/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests)
  - Experiment with some of Douglas Crockford's object creation ideas
    * eliminate use of the `this` keyword
    * eliminate use of the `new` keyword

## Installing

`npm install fidelity`

## Usage

A fidelity `promise` takes a function as an argument. This function accepts a
`resolve` and a `reject` object. Suppose we have a function `f()` that takes
some time to complete asynchronously. We can call this function using a promise.

    var Fidelity = require('fidelity');

    var p = Fidelity.promise(function(resolve, reject) {
      var result = f();
      if (result) {
        resolve(f);
      } else {
        reject('Some error occurred');
      }
    })

The object returned from a call to `promise()` has a function, `then()`. This
function takes two arguments, each a function. The first is called with the return
value (if any) of the promise function if it is successfully fulfilled. The
second function is called in the event of an error.

    p.then(function(result) {
      console.log('sucessful result ', result);
    }, function(err) {
      console.log('whoops!', err);
    });

## Testing

To run the full suite of the Promises/A+ spec, run `npm test` from the command line.
