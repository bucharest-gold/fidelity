var Fidelity = require('../lib/index.js');

function resolved (value) {
  return Fidelity.promise(function (resolve, reject) {
    resolve(value);
  });
}

function rejected (reason) {
  return Fidelity.promise(function (resolve, reject) {
    reject(reason);
  });
}

module.exports = {
  resolved: resolved,
  rejected: rejected,
  deferred: Fidelity.deferred
};
