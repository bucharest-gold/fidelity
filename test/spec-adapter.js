var promise = require('../lib/index.js');

function resolved(value) {
  return promise(function(resolve, reject) {
    resolve(value);
  });
}

function rejected(reason) {
  return promise(function(resolve, reject) {
    reject(reason);
  });
}

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

module.exports = {
  resolved: resolved,
  rejected: rejected,
  deferred: deferred
};
