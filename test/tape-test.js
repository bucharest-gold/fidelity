'use strict';

const test = require('tape');
const Promise = require('../lib/index.js');

test('A promise should begin life in a PENDING state', (t) => {
  const p = new Promise();
  t.equal(p.state, Promise.PENDING);
  t.end();
});

test('Promise.resolve should return a fulfilled promise', (t) => {
  const resolved = Promise.resolve(10);
  t.equal(typeof resolved, 'object');
  t.equal(resolved.state, Promise.FULFILLED);
  t.equal(resolved.value, 10);
  t.end();
});

test('promise.then() should resolve a value', (t) => {
  const expected = 'testThen resolution value';
  new Promise((resolve, reject) => {
    resolve(expected);
  }).then((value) => {
    t.equal(expected, value);
    t.end();
  });
});

test('A resolved promise state should be FULFILLED', (t) => {
  const p = new Promise((resolve, reject) => {
    resolve();
  });
  p.then((value) => {
    t.equal(p.state, Promise.FULFILLED);
    t.end();
  });
});

test('A failed promise state should be REJECTED', (t) => {
  const err = new Error('Something bad happened');
  const p = new Promise((resolve, reject) => {
    reject(err);
  });
  p.then(undefined, (e) => {
    t.deepEqual(e, err);
    t.equal(p.state, Promise.REJECTED);
    t.end();
  });
});

test('A promise should eventually resolve', (t) => {
  let resolver;
  new Promise((resolve, reject) => {
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
  Promise.resolve(sentinel)
    .then((value) => {
      t.deepEqual(value, sentinel);
      t.end();
    });
});

test('A promise should pass A+ spec 2.2.2.2 fulfilled after a delay', (t) => {
  const d = Promise.deferred();
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
  const p = new Promise((resolve, reject) => {
    process.nextTick(() => resolve('First resolved value'));
  });

  p.then(function (value) {
    t.strictEqual(value, 'First resolved value');
    return new Promise((resolve) => {
      resolve('Second resolved value');
    });
  }).then(function (value) {
    t.strictEqual(value, 'Second resolved value');
    t.end();
  });

  test('romise.catch()', (t) => {
    new Promise((resolve, reject) => {
      throw new Error('Test exception');
    })
    .then((_) => {
      t.fail('Promise should short circuit to catch');
    })
    .catch((e) => {
      t.strictEqual(e.message, 'Test exception');
      t.end();
    });
  });

  test('promise.then.catch()', (t) => {
    new Promise((resolve, reject) => {
      resolve('Test value');
    })
    .then((v) => {
      t.strictEqual(v, 'Test value');
      throw new Error('Test exception');
    })
    .catch((e) => {
      t.strictEqual(e.message, 'Test exception');
      t.end();
    });
  });

  test('Promise.resolve', (t) => {
    t.strictEqual(Promise.resolve(null).value, null);
    t.strictEqual(Promise.resolve(undefined).value, undefined);
    t.strictEqual(Promise.resolve(true).value, true);
    t.strictEqual(Promise.resolve(false).value, false);
    t.strictEqual(Promise.resolve(0).value, 0);
    t.strictEqual(Promise.resolve('').value, '');
    t.strictEqual(Promise.resolve(Infinity).value, Infinity);
    t.strictEqual(Promise.resolve(-Infinity).value, -Infinity);
    t.strictEqual(Promise.resolve(new Promise((resolve, reject) => {
      resolve('Test resolution');
    })).value, 'Test resolution');
    t.end();
  });

  test('Promise.reject should produce a rejected promise', (t) => {
    const promise = Promise.reject('some failure reason');
    t.ok(promise instanceof Promise);
    t.strictEqual(promise.value, 'some failure reason');
    t.strictEqual(promise.state, Promise.REJECTED);
    t.end();
  });

  test('Promise.all returns an array of all results if none are rejected', (t) => {
    const p1 = Promise.resolve(1);
    const p2 = 2;
    const p3 = new Promise((resolve, reject) => { setTimeout(resolve, 100, 3); });

    Promise.all(p1, p2, p3)
      .then((result) => {
        t.looseEqual(result, [1, 2, 3]);
        t.end();
      });
  });

  test('Promise.all returns the reason for the first rejected promise', (t) => {
    const p1 = Promise.resolve(1);
    const p2 = new Promise((resolve, reject) => { setTimeout(reject, 100, 'first'); });
    const p3 = 2;
    const p4 = new Promise((resolve, reject) => { setTimeout(reject, 100, 'second'); });

    Promise.all([p1, p2, p3, p4])
      .then((_) => t.fail)
      .catch((reason) => {
        t.equal(reason, 'first');
        t.end();
      });
  });

  test('Promise.all works with just a single promise', (t) => {
    Promise.all(Promise.resolve(1))
      .then((result) => {
        t.looseEqual(result, [1]);
        t.end();
      });
  });

  test('Promise.race returns the first promise to resolve', (t) => {
    const p1 = new Promise((resolve, reject) => { setTimeout(resolve, 100, 'foo'); });
    const p2 = new Promise((resolve, reject) => { setTimeout(resolve, 500, 'bar'); });

    Promise.race(p1, p2).then(result => {
      t.strictEquals(result, 'foo');
      t.end();
    }).catch((e) => t.fail(e));
  });

  test('Promise.race returns the first promise to resolve', (t) => {
    const p1 = new Promise((resolve, reject) => { setTimeout(resolve, 500, 'foo'); });
    const p2 = new Promise((resolve, reject) => { setTimeout(resolve, 200, 'bar'); });
    const p3 = new Promise((resolve, reject) => { setTimeout(reject, 50, 'baz'); });

    Promise.race([p1, p2, p3])
      .then(a => t.fail('Promise should not resolve'))
      .catch(e => {
        t.strictEquals(e, 'baz');
        t.end();
      });
  });

  test('Promise.race works with a single parameter', (t) => {
    Promise.race(Promise.resolve('foo')).then(result => {
      t.strictEquals(result, 'foo');
      t.end();
    }).catch((e) => t.fail(e));
  });
});
