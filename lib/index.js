(function () {
  'use strict';
   /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global === 'object' && global && global.Object === Object && global;

  /** Used as a reference to the global object. */
  var root = freeGlobal || Function('return this')();

  const PENDING = 0;
  const FULFILLED = 1;
  const REJECTED = 2;
  const HANDLERS = Symbol('handlers');
  const QUEUE = Symbol('queue');
  const STATE = Symbol('state');
  const VALUE = Symbol('value');

  /**
   * Represents the eventual result of an asynchronous operation.
   */
  class FidelityPromise {
    /**
     * Creates a new FidelityPromise.
     * @param {function} - The executor function. It is executed immediately,
     * and should accept two resolver functions, 'resolve' and 'reject'.
     * Calling them either fulfills or rejects the promise, respectively.
     * Typically, the executor function will initiate some asynchronous task,
     * and the call 'resolve' with the result, or 'reject' if there was an error.
     */
    constructor (fn) {
      this[QUEUE] = [];
      this[HANDLERS] = new Handlers();
      this[STATE] = PENDING;
      this[VALUE] = undefined;

      const fnType = typeof fn;
      if (fnType === 'function') {
        tryFunction(fn, this);
      } else if (fnType !== 'undefined') {
        resolvePromise(this, fn);
      }
    }

    /**
     * Returns the current state of this promise. Possible values are
     * `Fidelity.PENDING`, `Fidelity.FULFILLED`, or `Fidelity.REJECTED`.
     * @return the current state of this promise.
     */
    get state () {
      return this[STATE];
    }

    /**
     * Gets the current value of this promise. May be undefined.
     * @return the current value of this promise
     */
    get value () {
      return this[VALUE];
    }

    /**
     * Follows the [Promises/A+](https://promisesaplus.com/) spec
     * for a `then` function.
     * @param {function} onFulfilled - the function to invoke when this promise
     * has been resolved.
     * @param {function} onRejected - the function to invoke when this promise
     * has been rejected.
     * @return {FidelityPromise}
     */
    then (onFulfilled, onRejected) {
      const next = new FidelityPromise();
      if (typeof onFulfilled === 'function') {
        next[HANDLERS].fulfill = onFulfilled;
      }
      if (typeof onRejected === 'function') {
        next[HANDLERS].reject = onRejected;
      }
      this[QUEUE].push(next);
      process(this);
      return next;
    }

    /**
     * Syntactic sugar for `this.then(null, onRejected)`.
     * @param {function} onRejected - the function to invoke
     * when this promise is rejected.
     * @return {FidelityPromise}
     */
    catch (onRejected) {
      return this.then(null, onRejected);
    }

    /**
     * Creates a promise that will be resolved or rejected at some time
     * in the future.
     * @param {function} fn The function that will do the work of this promise.
     * The function is passed two function arguments, `resolve()` and `reject()`.
     * Call one of these when the work has completed (or failed).
     * @returns {FidelityPromise} A promise object
     * @deprecated Use new FidelityPromise()
     */
    static promise (fn) {
      console.error('Fidelity.promise() is deprecated. Use `new Fidelity.Promise()`.');
      return new FidelityPromise(fn);
    }

    /**
     * Creates a `deferred` object, containing a promise which may
     * be resolved or rejected at some point in the future.
     * @returns {object} deferred The deferred object
     * @returns {function} deferred.resolve(value) The resolve function
     * @returns {function} deferred.reject(cause) The reject function
     * @returns {object} deferred.promise The inner promise object
     */
    static deferred () {
      let resolver, rejecter;
      const p = new FidelityPromise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });

      return {
        promise: p,
        resolve: (value) => resolver(value),
        reject: (cause) => rejecter(cause)
      };
    }

    /**
     * Returns a promise that is resolved with `value`.
     * @param {any} value The value to resolve the returned promise with
     * @returns {FidelityPromise} A promise resolved with `value`
     */
    static resolve (value) {
      if (value && value.then) return value;

      switch (value) {
        case null:
          return NULL;
        case true:
          return TRUE;
        case false:
          return FALSE;
        case 0:
          return ZERO;
        case '':
          return EMPTYSTRING;
      }

      const p = new FidelityPromise();
      p[STATE] = FULFILLED;
      p[VALUE] = value;
      return p;
    }

    /**
     * Returns a promise that has been rejected.
     * @param {any} reason The reason the promise was rejected
     * @return {FidelityPromise} a rejected promise
     */
    static reject (reason) {
      const p = new FidelityPromise();
      p[STATE] = REJECTED;
      p[VALUE] = reason;
      return p;
    }

    /**
     * Returns the results of all resolved promises, or the
     * cause of the first failed promise.
     * @param {iterable} promises an iterable
     * @returns {any} an Array of results, or the cause of the first rejected promise
     */
    static all (/* promises - an iterable */) {
      const results = [];
      const promises = Array.from(arguments).reduce((a, b) => a.concat(b), []);
      const merged = promises.reduce(
        (acc, p) => acc.then(() => p).then(r => results.push(r)),
        Promise.resolve(null));
      return merged.then(_ => results);
    }

    /**
     * Returns a promise that resolves or rejects as soon as one of the
     * promises in the supplied iterable resolves or rejects with the value
     * or reason from that promise.
     * @param {iterable} promises an iterable
     * @returns {any} the first value or cause that was resolved or rejected by
     * one of the supplied promises.
     */
    static race (/* promises - an iterable */) {
      const promises = Array.from(arguments).reduce((a, b) => a.concat(b), []);
      return new FidelityPromise((resolve, reject) => {
        promises.forEach(p => p.then(resolve).catch(reject));
      });
    }
  }

  FidelityPromise.PENDING = PENDING;
  FidelityPromise.FULFILLED = FULFILLED;
  FidelityPromise.REJECTED = REJECTED;

  class Handlers {
    constructor () {
      this.fulfill = null;
      this.reject = null;
    }
  }

  const nextTick = (() => {
    if (root.process && typeof root.process.nextTick === 'function') {
      return root.process.nextTick;
    } else if (typeof root.setImmediate === 'function') {
      return root.setImmediate;
    } else if (typeof root.setTimeout === 'function') {
      return (f, p) => root.setTimeout(f, 0, p);
    } else {
      console.error('No nextTick. How we gonna do this?');
      return (f, p) => f.call(this, p);
    }
  })();

  function exportModule (exported) {
    if (typeof module === 'object' && module.exports) {
      // we're in a node.js environment
      module.exports = exported;
    } else {
      // in a browser environment
      root[exported.name] = exported;
    }
  }

  const TRUE = new FidelityPromise(true);
  const FALSE = new FidelityPromise(false);
  const NULL = new FidelityPromise(null);
  const ZERO = new FidelityPromise(0);
  const EMPTYSTRING = new FidelityPromise('');

  function tryFunction (fn, promise) {
    try {
      fn(v => resolvePromise(promise, v), r => transition(promise, REJECTED, r));
    } catch (e) {
      transition(promise, REJECTED, e);
    }
  }

  function resolvePromise (p, x) {
    if (x === p) {
      transition(p, REJECTED, new TypeError('The promise and its value are the same.'));
      return;
    }

    const typeOfX = typeof x;
    if (x && ((typeOfX === 'function') || (typeOfX === 'object'))) {
      let called = false;
      try {
        const thenFunction = x.then;
        if (thenFunction && (typeof thenFunction === 'function')) {
          thenFunction.call(x, (y) => {
            if (!called) {
              resolvePromise(p, y);
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
    } else {
      transition(p, FULFILLED, x);
    }
  }

  function process (p) {
    if (p[STATE] === PENDING) return;
    nextTick(processNextTick, p);
    return p;
  }

  function processNextTick (p) {
    let handler, qp;
    while (p[QUEUE].length) {
      qp = p[QUEUE].shift();
      if (p[STATE] === FULFILLED) {
        handler = qp[HANDLERS].fulfill || ((v) => v);
      } else if (p[STATE] === REJECTED) {
        handler = qp[HANDLERS].reject || ((r) => {
          throw r;
        });
      }
      try {
        resolvePromise(qp, handler(p[VALUE]));
      } catch (e) {
        transition(qp, REJECTED, e);
        continue;
      }
    }
  }

  function transition (p, state, value) {
    if (p[STATE] === state ||
      p[STATE] !== PENDING) return;
    p[STATE] = state;
    p[VALUE] = value;
    return process(p);
  }

  exportModule(FidelityPromise);
}.call(this));
