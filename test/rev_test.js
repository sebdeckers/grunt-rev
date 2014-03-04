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

    var exists = grunt.file.exists('tmp/9e107d9d.default.txt');
    test.ok(exists, '8 character MD5 hash prefix');

    test.done();
  },
  custom_options: function(test) {
    test.expect(1);

    var exists = grunt.file.exists('tmp/2fd4.custom.txt');
    test.ok(exists, '4 character SHA-1 hash prefix');

    test.done();
  },
  international_options: function(test) {
    test.expect(1);

    var exists = grunt.file.exists('tmp/faa07745.international.txt');
    test.ok(exists, '8 character MD5 hash prefix for international content');

    test.done();
  },
  alt_options: function(test) {
    test.expect(2);

    var existsOriginal = grunt.file.exists('tmp/3d0793d5.Open-Source-Logo.png');
    test.ok(existsOriginal, '8 character MD5 hash prefix for original image');
    var existsAlt = grunt.file.exists('tmp/3d0793d5.Open-Source-Logo@2x.png');
    test.ok(existsOriginal, '8 character MD5 hash prefix for alt image');

    test.done();
  },
  alt_options_array: function(test) {
    test.expect(2);

    var existsOriginal = grunt.file.exists('tmp/3d0793d5.Array-Source-Logo2.png');
    test.ok(existsOriginal, '8 character MD5 hash prefix for original image');
    var existsAlt = grunt.file.exists('tmp/3d0793d5.Array-Source-Logo2@2x.png');
    test.ok(existsOriginal, '8 character MD5 hash prefix for alt image');

    test.done();
  }
};
