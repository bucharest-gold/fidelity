'use strict';

class Handlers {
  constructor() {
    this.fulfill = null;
    this.reject = null;
  }
}

/**
 * @class promise
 */
class FidelityPromise {
  constructor(state, value) {
    this.state = state;
    this.value = value;
    this.queue = [];
    this.handlers = new Handlers();
    this._fidelity = true;
  }

  /**
   * Follows the [Promises/A+](https://promisesaplus.com/) spec
   * for a `then` function.
   * @returns a promise
   * @function then
   */
  then (onFulfilled, onRejected) {
    const next = new FidelityPromise(PENDING, null);
    if (typeof onFulfilled === 'function') {
      next.handlers.fulfill = onFulfilled;
    }
    if (typeof onRejected === 'function') {
      next.handlers.reject = onRejected;
    }
    this.queue.push(next);
    process(this);
    return next;
  }

  catch (onRejected) {
    return this.then(null, onRejected);
  }
}

const
  PENDING = 0,
  FULFILLED = 1,
  REJECTED = 2,
  TRUE = new FidelityPromise(FULFILLED, true),
  FALSE = new FidelityPromise(FULFILLED, false),
  NULL = new FidelityPromise(FULFILLED, null),
  UNDEFINED = new FidelityPromise(undefined),
  ZERO = new FidelityPromise(FULFILLED, 0),
  EMPTYSTRING = new FidelityPromise(FULFILLED, ''),

  /**
   * @module fidelity
   */
  FIDELITY = {
    promise: promise,
    deferred: deferred,
    resolve: resolveValue,
    PENDING: PENDING,
    FULFILLED: FULFILLED,
    REJECTED: REJECTED
  };

module.exports = FIDELITY;

/**
 * Creates a promise that will be resolved or rejected at some time
 * in the future.
 * @param {function} fn The function that will do the work of this promise.
 * The function is passed two function arguments, `resolve()` and `reject()`.
 * Call one of these when the work has completed (or failed).
 * @returns {object} A promise object
 * @instance
 */
function promise (fn) {
  const p = new FidelityPromise(PENDING, null);
  if (typeof fn === 'function') {
    try {
      fn((v) => resolve(p, v), (r) => transition(p, REJECTED, r));
    } catch (e) {
      transition(p, REJECTED, e);
    }
  }
  return p;
}

/**
 * Returns a promise that is resolved with `value`.
 * @param {any} value The value to resolve the returned promise with
 * @returns {object} A promise resolved with `value`
 * @method resolve
 * @instance resolve
 */
function resolveValue (value) {
  if (value && value.then) return value;

  switch (value) {
    case null: return NULL;
    case undefined: return UNDEFINED;
    case true: return TRUE;
    case false: return FALSE;
    case 0: return ZERO;
    case '': return EMPTYSTRING;
  }

  return new FidelityPromise(FULFILLED, value);
}

/**
 * Creates a `deferred` object, containing a promise which may
 * be resolved or rejected at some point in the future.
 * @returns {object} deferred The deferred object
 * @returns {function} deferred.resolve(value) The resolve function
 * @returns {function} deferred.reject(cause) The reject function
 * @returns {object} deferred.promise The inner promise object
 * @instance
 */
function deferred () {
  var resolver, rejecter,
    p = promise((resolve, reject) => {
      resolver = resolve;
      rejecter = reject;
    });

  function resolve (value) {
    resolver(value);
  }

  function reject (cause) {
    rejecter(cause);
  }

  return {
    promise: p,
    resolve: resolve,
    reject: reject
  };
}

function resolve (p, x) {
  if (x === p) {
    transition(p, REJECTED, new TypeError('The promise and its value are the same.'));
    return;
  }

  if (x && x._fidelity) {
    if (x.state === PENDING) {
      x.then((value) => resolve(p, value), (cause) => transition(p, REJECTED, cause));
    } else {
      transition(p, x.state, x.value);
    }
  } else if (x && ((typeof x === 'function') || (typeof x === 'object'))) {
    let called = false, thenFunction;
    try {
      thenFunction = x.then;
      if (thenFunction && (typeof thenFunction === 'function')) {
        thenFunction.call(x, (y) => {
          if (!called) {
            resolve(p, y);
            called = true;
          }
        }, (r) => {
          if (!called) {
            transition(p, REJECTED, r);
            called = true;
          }
        });
      } else {
        transition(p, FULFILLED, x);
        called = true;
      }
    } catch (e) {
      if (!called) {
        transition(p, REJECTED, e);
        called = true;
      }
    }
  }
  else transition(p, FULFILLED, x);
}

function process (p) {
  if (p.state === PENDING) return;
  global.process.nextTick(() => {
    let qp, handler, value;
    while(p.queue.length) {
      qp = p.queue.shift();
      if (p.state === FULFILLED) {
        handler = qp.handlers.fulfill || ((v) => v);
      } else if (p.state === REJECTED) {
        handler = qp.handlers.reject || ((r) => {
            throw r;
          });
      }
      try {
        value = handler(p.value);
      } catch(e) {
        transition(qp, REJECTED, e);
        continue;
      }
      resolve(qp, value);
    }
  });
  return p;
}

function transition (p, state, value) {
  if (p.state === state ||
    p.state !== PENDING ||
    arguments.length !== 3) return;
  p.state = state;
  p.value = value;
  return process(p);
}
