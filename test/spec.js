var adapter = require('./spec-adapter.js'),
    specs = require('promises-aplus-tests');

describe("Promises/A+ Tests", function () {
  specs.mocha(adapter);
});
