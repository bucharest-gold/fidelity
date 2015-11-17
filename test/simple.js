var assert = require('assert'),
    promise = require('../lib/index.js'),
    adapter = require('./spec-adapter.js');

describe('A fidelity promise', function() {

  it('should begin life in a PENDING state', function(done) {
    var p = promise();
    assert.equal(promise.PENDING, p.state);
    done();
  });

  describe('then()', function() {
    it('should resolve the value', function(done) {
      var p = promise(function(resolve, reject) {
        resolve('testThen resolution value');
      });

      p.then(function(value) {
        assert.equal(value, 'testThen resolution value');
        done();
      });
    });

    it('should set successfully completed promise state to FULFILLED', function(done) {
      var p = promise(function(resolve, reject) {
        resolve('testThen resolution value');
      });

      p.then(function(value) {
        assert.equal(promise.FULFILLED, p.state);
        done();
      });
    });

    it('should set a failed promise state to REJECTED', function(done) {
      var p = promise(function(resolve, reject) {
        reject('just not my day');
      });

      p.then(function(value) {
        assert.false(value);
      }, function(reason) {
        assert.equal(promise.REJECTED, p.state);
        done();
      });
    });

    it('should resolve eventually', function(done) {
      var resolver;
      var p = promise(function(resolve, reject) {
        resolver = resolve;
      }).then(function onFulfilled(value) {
        done();
      }, function onRejected(err) {
        assert.fail(err);
      });
      setTimeout(function() {
        resolver('Eventually Done!');
      }, 50);
    });

    it('should pass 2.2.2.1 already fulfilled', function(done) {
      var sentinel = { sentinel: "sentinel" };
      adapter.resolved(sentinel)
        .then(function onFulfilled(value) {
          assert.strictEqual(value, sentinel);
          done();
        });
    });

    it('should pass 2.2.2.2 fulfilled after a delay', function(done) {
      var d = adapter.deferred();
      var isFulfilled = false;
      var dummy = { dummy: "dummy" };

      d.promise.then(function onFulfilled() {
        assert.strictEqual(isFulfilled, true);
        done();
      });

      setTimeout(function () {
        d.resolve(dummy);
        isFulfilled = true;
      }, 50);
    });
  });
});



function testChainedPromises() {
  var p = promise(function(resolve, reject) {
    resolve('First resolved value');
  });

  p.then(function(value) {
    assert.equal(value, 'First resolved value');
    return promise(function(resolve) {
      resolve('Second resolved value');
    });
  }).then(function(value) {
    assert.equal(value, 'Second resolved value');
  });
}
