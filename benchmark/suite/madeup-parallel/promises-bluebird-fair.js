// This version of the bluebird benchmark "plays fair" and uses the
// same lifter as everyone else.  According to the bluebird author,
// `new Promise` "is an extremely slow way to create Promises" and so
// the bluebird `promisify` implementation cheats.
var Promise = require('bluebird');
global.useThisImpl = Promise;
require('../lib/fakesP');

module.exports = function upload(stream, idOrPath, tag, done) {
    var queries = new Array(global.parallelQueries);
    var tx = db.begin();

    for( var i = 0, len = queries.length; i < len; ++i ) {
        queries[i] = FileVersion.insert({index: i}).execWithin(tx);
    }

    Promise.all(queries).then(function() {
        tx.commit();
        done();
    }, function(err) {
        tx.rollback();
        done(err);
    });
}
