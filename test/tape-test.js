'use strict';

const test = require('tape');
const Fidelity = require('../lib/index.js');

test('A promise should begin life in a PENDING state', (t) => {
  const p = Fidelity.promise();
  t.equal(p.state, Fidelity.PENDING);
  t.end();
});

test('Fidelity.resolve should return a fulfilled promise', (t) => {
  const resolved = Fidelity.resolve(10);
  t.equal(typeof resolved, 'object');
  t.equal(resolved.state, Fidelity.FULFILLED);
  t.equal(resolved.value, 10);
  t.end();
});

test('promise.then() should resolve a value', (t) => {
  const expected = 'testThen resolution value';
  Fidelity.promise((resolve, reject) => {
    resolve(expected);
  }).then((value) => {
    t.equal(expected, value);
    t.end();
  });
});

test('A resolved promise state should be FULFILLED', (t) => {
  const p = Fidelity.promise((resolve, reject) => {
    resolve();
  });
  p.then((value) => {
    t.equal(p.state, Fidelity.FULFILLED);
    t.end();
  });
});

test('A failed promise state should be REJECTED', (t) => {
  const err = new Error('Something bad happened');
  const p = Fidelity.promise((resolve, reject) => {
    reject(err);
  });
  p.then(undefined, (e) => {
    t.deepEqual(e, err);
    t.equal(p.state, Fidelity.REJECTED);
    t.end();
  });
});

test('A promise should eventually resolve', (t) => {
  let resolver;
  const p = Fidelity.promise((resolve, reject) => {
    resolver = resolve;
  }).then((value) => {
    t.equal(value, 'Eventually Done!');
    t.end();
  }, (err) => {
    t.fail(err);
  });
  setTimeout(() => {
    resolver('Eventually Done!');
  }, 50);
});

test('A promise should pass A+ spec 2.2.2.1 already fulfilled', (t) => {
  const sentinel = { sentinel: 'sentinel' };
  Fidelity.resolve(sentinel)
    .then((value) => {
      t.deepEqual(value, sentinel);
      t.end();
    });
});

test('A promise should pass A+ spec 2.2.2.2 fulfilled after a delay', (t) => {
  const d = Fidelity.deferred();
  const dummy = { dummy: 'dummy' };
  let isFulfilled = false;

  d.promise.then(() => {
    t.strictEqual(isFulfilled, true);
    t.end();
  });

  setTimeout(function () {
    d.resolve(dummy);
    isFulfilled = true;
  }, 50);
});

test('Promises should chain', (t) => {
  const p = Fidelity.promise((resolve, reject) => {
    resolve('First resolved value');
  });

  p.then(function (value) {
    t.strictEqual(value, 'First resolved value');
    return Fidelity.promise((resolve) => {
      resolve('Second resolved value');
    });
  }).then(function (value) {
    t.strictEqual(value, 'Second resolved value');
    t.end();
  });
});
