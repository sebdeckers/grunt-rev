/*
 * grunt-rev
 * https://github.com/cbas/grunt-rev
 *
 * Copyright (c) 2013 Sebastiaan Deckers
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
  path = require('path'),
  crypto = require('crypto');

module.exports = function(grunt) {

  function md5(filepath, algorithm, encoding, fileEncoding) {
    var hash = crypto.createHash(algorithm);
    grunt.log.verbose.write('Hashing ' + filepath + '...');
    hash.update(grunt.file.read(filepath), fileEncoding);
    return hash.digest(encoding);
  }

  grunt.registerMultiTask('rev', 'Prefix static asset file names with a content hash', function() {

    var options = this.options({
      encoding: 'utf8',
      algorithm: 'md5',
      length: 8
    });
    var dest = this.data.dest;
    
    this.files.forEach(function(filePair) {
      filePair.src.forEach(function(f) {
        var hash = md5(f, options.algorithm, 'hex', options.encoding),
          prefix = hash.slice(0, options.length),
          renamed = [prefix, path.basename(f)].join('.'),
          outPath = path.resolve( dest || path.dirname(f), renamed);
          
        grunt.verbose.ok().ok(hash);
        
        // If a destination dir has been specified, copy the file to the new location rather than renaming
        if ( dest ) {
          fs.mkdirSync(dest);
          fs.createReadStream(f).pipe(fs.createWriteStream(outPath));
        } else {
          fs.renameSync(f, outPath);
        }
        
        grunt.log.write(f + ' ').ok(renamed);

      });
    });

  });

};
