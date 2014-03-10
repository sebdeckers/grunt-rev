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
    test.expect(6);

    var existsOriginal = grunt.file.exists('tmp/ecea3614.Open-Source-Logo.png');
    test.ok(existsOriginal, '8 character MD5 hash prefix for original image 1');
    var existsAlt = grunt.file.exists('tmp/ecea3614.Open-Source-Logo@2x.png');
    test.ok(existsAlt, '8 character MD5 hash prefix for alt image 1 @ 2x');
    var existsAlt2 = grunt.file.exists('tmp/ecea3614.Open-Source-Logo@2x.png');
    test.ok(existsAlt2, '8 character MD5 hash prefix for alt image 1 @ 4x');

    var existsOriginalV2 = grunt.file.exists('tmp/de0ee580.Open-Source-Divider.png');
    test.ok(existsOriginalV2, '8 character MD5 hash prefix for original image 2');
    var existsAltV2 = grunt.file.exists('tmp/de0ee580.Open-Source-Divider@2x.png');
    test.ok(existsAlt, '8 character MD5 hash prefix for alt image 2 @ 2x');

    var existsAltNo = grunt.file.exists('tmp/9aa33131.Open-Source-Logo-No-Alt.png');
    test.ok(existsAltNo, '8 character MD5 hash prefix for not alt image');

    test.done();
  },
  alt_options_default: function(test) {
    test.expect(2);

    var existsOriginal = grunt.file.exists('tmp/45c45315.Default-Source-Logo.png');
    test.ok(existsOriginal, '8 character MD5 hash prefix for original image');
    var existsAlt = grunt.file.exists('tmp/45c45315.Default-Source-Logo_2x.png');
    test.ok(existsAlt, '8 character MD5 hash prefix for alt image');

    test.done();
  },
  alt_options_off: function(test) {
    test.expect(2);

    var existsOriginal = grunt.file.exists('tmp/89e088f6.Off-Source-Logo.png');
    test.ok(existsOriginal, '8 character MD5 hash prefix for original image');
    var existsAlt = grunt.file.exists('tmp/66ff15cd.Off-Source-Logo@2x.png');
    test.ok(existsAlt, '8 character MD5 hash prefix for alt image');

    test.done();
  },
  alt_options_array: function(test) {
    test.expect(6);

    var exists, expectedFiles = [
     'tmp/c6aa5421.Array-Source-button.png',
     'tmp/c6aa5421.Array-Source-button-hover.png',
     'tmp/c6aa5421.Array-Source-button-active.png',
     'tmp/a09661e5.Array-Source-Logo.png',
     'tmp/a09661e5.Array-Source-Logo_2x.png',
     'tmp/a09661e5.Array-Source-Logo_4x.png'
    ];

    for (var i = 0; i < expectedFiles.length; i++) {
      exists = grunt.file.exists(expectedFiles[i]);
      test.ok(exists, 'File expected: ' + expectedFiles[i]);
    }

    test.done();
  }
};
