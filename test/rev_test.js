'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.rev = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var exists = grunt.file.exists('tmp/default.9e107d9d.txt');
    test.ok(exists, '8 character MD5 hash suffix');

    test.done();
  },
  custom_options: function(test) {
    test.expect(1);

    var exists = grunt.file.exists('tmp/custom.2fd4.txt');
    test.ok(exists, '4 character SHA-1 hash suffix');

    test.done();
  },
  international_options: function(test) {
    test.expect(1);

    var exists = grunt.file.exists('tmp/international.faa07745.txt');
    test.ok(exists, '8 character MD5 hash suffix for international content');

    test.done();
  }
};
