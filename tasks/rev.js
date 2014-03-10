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
    var hash = crypto.createHash(algorithm), i;
    if (grunt.util.kindOf(filepath) === 'array') {
      grunt.log.verbose.write('Hashing group "' + filepath.join('", "') + '" ...');
      for (i = 0; i < filepath.length; i += 1) {
        hash.update(grunt.file.read(filepath[i]), fileEncoding);
      }
    } else {
      grunt.log.verbose.write('Hashing ' + filepath + '...');
      hash.update(grunt.file.read(filepath), fileEncoding);
    }
    return hash.digest(encoding);
  }

  function findMatchingFiles(matchData, matchDataAll) {
    var baseFilename = matchData[1] + matchData[3],
      machingFiles = [baseFilename], i;
    for (i = 0; i < matchDataAll.length; i += 1) {
      if (matchData[1] === matchDataAll[i][1] && matchData[3] === matchDataAll[i][3]) {
        machingFiles.push(matchDataAll[i][0]);
      }
    }

    return machingFiles;
  }

  function combineGroups(pattern, matchData) {
    var groups = [],
      iFiles, filesLength = matchData.matching.length,
      matchingFiles,
      matchedNames = [];

    for (iFiles = 0; iFiles < filesLength; iFiles += 1) {
      if (matchedNames.indexOf(matchData.matching[iFiles][0]) >= 0) {
        continue;
      }
      matchingFiles = findMatchingFiles(matchData.matching[iFiles], matchData.matching);
      matchedNames = matchedNames.concat(matchingFiles);
      groups.push(matchingFiles);
    }

    return groups;
  }

  grunt.registerMultiTask('rev', 'Prefix static asset file names with a content hash', function() {

    var options = this.options({
      alternatesPattern: /[@_]\dx/,
      encoding: 'utf8',
      algorithm: 'md5',
      length: 8
    });

    var alternatesPatterns = [];
    if (options.alternatesPattern === null) {
      alternatesPatterns = [];
    } else if (grunt.util.kindOf(options.alternatesPattern) === 'array') {
      alternatesPatterns = options.alternatesPattern;
    } else {
      alternatesPatterns = [options.alternatesPattern];
    }

    var i, match, regexp,
      regexps = [],
      matchingFiles = {},
      patternsLength = alternatesPatterns.length;

    // Prepare regexps
    for (i = 0; i < patternsLength; i += 1) {
      if (grunt.util.kindOf(alternatesPatterns[i]) !== 'regexp') {
        grunt.fatal('alternates pattern must be a regular expression');
      }
      regexp = new RegExp('^(.*)(' + alternatesPatterns[i].source + ')(\\.(?:jpg|png|gif|webp))$');
      regexps.push(regexp);
      matchingFiles[alternatesPatterns[i].source] = { regexp: regexp, matching: [] };
    }

    // Find matching files
    this.files.forEach(function(filePair) {
      filePair.src.forEach(function(f) {
        for (i = 0; i < patternsLength; i += 1) {
          match = regexps[i].exec(f);
          if (match !== null) {
            matchingFiles[alternatesPatterns[i].source].matching.push(match);
            // Limitation: a file can only match one pattern
            break;
          }
        }
      });
    });

    // Combine into groups
    var combinedGroups, pattern, groups = [];
    for (pattern in matchingFiles) {
      if (matchingFiles.hasOwnProperty(pattern)) {
        combinedGroups = combineGroups(pattern, matchingFiles[pattern]);
        groups = groups.concat(combinedGroups);
      }
    }

    // Handle groups
    var group, j, k, hash, prefix, renamed, outPath, f, handledFiles = [];
    for (k = 0; k < groups.length; k += 1) {
      group = groups[k];
      hash = md5(group, options.algorithm, 'hex', options.encoding);
      prefix = hash.slice(0, options.length);
      grunt.verbose.ok(hash);
      for (j = 0; j < group.length; j += 1) {
        f = group[j];
        renamed = [prefix, path.basename(f)].join('.');
        outPath = path.resolve(path.dirname(f), renamed);

        fs.renameSync(f, outPath);
        grunt.log.write(f + ' ').ok(renamed);
        handledFiles.push(f);
      }
    }

    // Handle the rest of the files
    this.files.forEach(function(filePair) {
      filePair.src.forEach(function(f) {
        if (handledFiles.indexOf(f) < 0) {
          hash = md5(f, options.algorithm, 'hex', options.encoding);
          prefix = hash.slice(0, options.length);
          renamed = [prefix, path.basename(f)].join('.');
          outPath = path.resolve(path.dirname(f), renamed);

          grunt.verbose.ok().ok(hash);
          fs.renameSync(f, outPath);
          grunt.log.write(f + ' ').ok(renamed);
        }
      });
    });
  });
};
