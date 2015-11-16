var promise = module.exports  = (function() {
  var PENDING = 0,
      FULFILLED = 1,
      REJECTED = 2;

  function promise(fn) {

    var handlers = [],
        p = {
          state: PENDING,
          value: null,
          cause: null,
          then: then,
          done: done
        };

    function resolve(result) {
      try {
        if (isPromise(result)) {
          doResolve(result.then.bind(result), resolve, reject);
        } else {
          fulfill(result);
        }
      } catch (e) {
        reject(e);
      }
    }

    function reject(cause) {
      p.state = REJECTED;
      p.cause = cause;
      processHandlers();
    }

    function fulfill(result) {
      p.state = FULFILLED;
      p.value = result;
      processHandlers();
    }

    function doResolve(fn, resolved, rejected) {
      var done = false;

      try {
        fn(_resolve(resolved), _resolve(rejected));
      } catch (ex) {
        _resolve(rejected)(ex);
      }

      function _resolve(f) {
        return function(value) {
          if (!done) {
            done = true;
            f(value);
          }
        };
      }
    }

    function processHandlers() {
      if (handlers) handlers.forEach(handle);
      handlers = null;
    }

    function isPromise(obj) {
      if (obj === p) throw new TypeError('Cannot self chain promises');
      return (obj && (typeof obj.then) === 'function') ? obj.then : false;
    }

    function handle(handler) {
      switch(p.state) {
      case PENDING:
        handlers.push(handler);
        break;
      case FULFILLED:
        if (typeof handler.onFulfilled === 'function')
          handler.onFulfilled(p.value);
        break;
      case REJECTED:
        if (typeof handler.onRejected ==='function')
          handler.onRejected(p.cause);
        break;
      }
    }

    function done(onFulfilled, onRejected) {
      setTimeout(function completed() {
        handle({
          onFulfilled: onFulfilled,
          onRejected: onRejected
        });
      }, 50);
    }

    function then(onFulfilled, onRejected) {
      return promise(function(resolve, reject) {
        return done(function(result) {
          if (typeof onFulfilled === 'function') {
            try {
              return resolve(onFulfilled(result));
            } catch (ex) {
              return reject(ex);
            }
          } else {
            return resolve(result);
          }
        }, function(cause) {
          if (typeof onRejected === 'function') {
            try {
              return resolve(onRejected(cause));
            } catch (ex) {
              return reject(ex);
            }
          } else {
            return reject(cause);
          }
        });
      });

    }

    doResolve(fn, resolve, reject);
    return p;
  }
  promise.PENDING = PENDING;
  promise.FULFILLED = FULFILLED;
  promise.REJECTED = REJECTED;
  return promise;
})();
