function resolved (value) {
  return new FidelityPromise(function (resolve, reject) {
    resolve(value);
  });
}

function rejected (reason) {
  return new FidelityPromise(function (resolve, reject) {
    reject(reason);
  });
}

describe("Promises/A+ Tests", function () {
    require("promises-aplus-tests").mocha({
        resolved: resolved,
        rejected: rejected,
        deferred: FidelityPromise.deferred
    });
});