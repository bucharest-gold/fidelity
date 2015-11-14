var assert = require('assert'),
    promise = require('../lib/index.js');

describe('A fidelity promise', function() {

  it('should begin life in a PENDING state', function(done) {
    var p = promise(function() { });
    assert.equal(promise.PENDING, p.state);
    done();
  });

  describe('done()', function() {
    it('should resolve the value', function (done) {
      var p = promise(function(resolve, reject) {
        resolve('testDone resolution value');
      });

      p.done(function(value) {
        assert.equal(value, 'testDone resolution value');
        done();
      });
    });

    it('should set successfuylly completed promise state to FULFILLED', function (done) {
      var p = promise(function(resolve, reject) {
        resolve('testDone resolution value');
      });

      p.done(function(value) {
        assert.equal(promise.FULFILLED, p.state);
        done();
      });
    });

    it('should resolve the value asynchronously', function(done) {
      var p = promise(function(resolve, reject) {
        setImmediate(function() {
          resolve('testDone resolution value');
        });
      });

      p.done(function(value) {
        assert.equal(value, 'testDone resolution value');
        assert.equal(promise.FULFILLED, p.state);
        done();
      });
    });

    it('should give a reason for failed tasks', function(done) {
      var p = promise(function(resolve, reject) {
        setImmediate(function() {
          reject('You smell funny');
        });
      });

      p.done(function(value) {
        assert.equal(value, null);
      },
      function(reason) {
        assert.equal(reason, 'You smell funny');
        done();
      });
    });

    it('should set a failed promise state to REJECTED', function(done) {
      var p = promise(function(resolve, reject) {
        setImmediate(function() {
          reject('You smell funny');
        });
      });

      p.done(function(value) { assert.equal(value, null); },
             function(reason) { assert.equal(promise.REJECTED, p.state); done();});
    });
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
      }, function(reason) {
        assert.equal(promise.REJECTED, p.state);
        done();
      });
    });
  });
});



function testChainedPromises() {
  console.log('testChainedPromises');
  var p = promise(function(resolve, reject) {
    console.log('first promise resolving');
    resolve('First resolved value');
  });

  p.then(function(value) {
    console.log('first promise complete');
    assert.equal(value, 'First resolved value');
    return promise(function(resolve) {
      console.log('second promise resolving');
      resolve('Second resolved value');
    });
  }).then(function(value) {
    console.log('second promise complete');
    assert.equal(value, 'Second resolved value');
    console.log('testChainedPromises complete');
  });
}
