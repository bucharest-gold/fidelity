(function(root) {
  "use strict";

  var PENDING = 0,
      FULFILLED = 1,
      REJECTED = 2,
      FIDELITY = {
        promise: promise,
        deferred: deferred
      };

  function promise(fn) {

    var p = {
      state: PENDING,
      identify: 'fidelity',
      value: null,
      queue: [],
      handlers: {
        fulfill: null,
        reject: null
      }
    };
    p.then = then(p);

    if (isA('function', fn)) {
      fn(
        function(v) { resolve(p, v); },
        function(r) { reject(p, r); }
      );
    }

    return p;
  }

  function then(p) {
    return function(onFulfilled, onRejected) {
      var q = promise();
      if (isA('function', onFulfilled)) {
        q.handlers.fulfill = onFulfilled;
      }
      if (isA('function', onRejected)) {
        q.handlers.reject = onRejected;
      }
      p.queue.push(q);
      process(p);
      return q;
    };
  }

  function resolve(p, x) {
    if (x === p)
      reject(p, new TypeError('The promise and its value are the same.'));

    if (isPromise(x)) {
      if (x.state === PENDING) {
        x.then(function(value) {
          resolve(p, value);
        }, function(cause) {
          reject(p, cause);
        });
      } else {
        transition(p, x.state, x.value);
      }
    } else if (isA('function', x) || isA('object', x)) {
      var called = false, thenFunction;
      try {
        thenFunction = x.then;
        if (isA('function', thenFunction)) {
          thenFunction.call(x, function(y) {
            if (!called) {
              resolve(p, y);
              called = true;
            }
          }, function (r) {
            if (!called) {
              reject(p, r);
              called = true;
            }
          });
        } else {
          fulfill(p, x);
          called = true;
        }
      } catch (e) {
        if (!called) {
          reject(p, e);
          called = true;
        }
      }
    }
    else fulfill(p, x);
  }

  function fulfill(p, result) {
    transition(p, FULFILLED, result);
  }

  function reject(p, cause) {
    transition(p, REJECTED, cause);
  }

  function defaultFulfill(v) { return v; }

  function defaultReject(r) { throw r; }

  function process(p) {
    if (p.state === PENDING) return;
    setTimeout(function() {
      while(p.queue.length) {
        var qp = p.queue.shift(),
            handler, value;
        if (p.state === FULFILLED) {
          handler = qp.handlers.fulfill || defaultFulfill;
        } else if (p.state === REJECTED) {
          handler = qp.handlers.reject || defaultReject;
        }
        try {
          value = handler(p.value);
        } catch(e) {
          transition(qp, REJECTED, e);
          continue;
        }
        resolve(qp, value);
      }
    }, 0);
  }

  function transition(p, state, value) {
    if (p.state === state ||
        p.state !== PENDING ||
        arguments.length !== 3) return;
    p.state = state;
    p.value = value;
    process(p);
  }

  function isA(type, x) {
    return x && typeof x === type;
  }

  function isPromise(x) {
    return x && x.identify === 'fidelity';
  }

  promise.PENDING = PENDING;
  promise.FULFILLED = FULFILLED;
  promise.REJECTED = REJECTED;

  function deferred() {
    var resolver, rejecter,
        p = promise(function(resolve, reject) {
          resolver = resolve;
          rejecter = reject;
        });

    function resolve(value) {
      resolver(value);
    }

    function reject(cause) {
      rejecter(cause);
    }

    return {
      promise: p,
      resolve: resolve,
      reject: reject
    };
  }

  if (module && module.exports) module.exports = FIDELITY;
  else root.FIDELITY = FIDELITY;
})(this);
