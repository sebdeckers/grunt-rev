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
  crypto = require('crypto'),
  globex = require('glob-to-regexp'),
  _s = require('underscore.string');

module.exports = function(grunt) {

  function md5(filepath, algorithm, encoding, fileEncoding) {
    var hash = crypto.createHash(algorithm);
    grunt.log.verbose.write('Hashing ' + filepath + '...');
    hash.update(grunt.file.read(filepath), fileEncoding);
    return hash.digest(encoding);
  }

  function findAndBuildMatch(altObj, patternMatch, prefixMap) {
    var baseRegexp = globex(altObj.pattern, { extended: true }),
      identifierRegexp = globex(altObj.identifier, { extended: true }),
      identifierRegexpSource = _s.trim(identifierRegexp.source, '/^$'),
      identifierMatchingRegexp = new RegExp(baseRegexp.source.replace(identifierRegexpSource, '(' + identifierRegexpSource + ')')),
      identifierExcludingRegexp = new RegExp('^(' + _s.trim(baseRegexp.source, '^$').replace(identifierRegexpSource, ')' + identifierRegexpSource + '(') + ')$'),
      matchingResult, excludingResult;

    matchingResult = identifierMatchingRegexp.exec(patternMatch);
    excludingResult = identifierExcludingRegexp.exec(patternMatch);
    if (matchingResult === null || excludingResult === null) {
      return null;
    }

    var originalName = excludingResult[1] + excludingResult[2],
      prefix = prefixMap[originalName],
      prefixedName, lastDirIndex;

    if (prefix) {
      lastDirIndex = excludingResult[1].lastIndexOf('/') + 1;
      prefixedName = excludingResult[1].substr(0, lastDirIndex) +
        prefix +
        '.' +
        excludingResult[1].substr(lastDirIndex) +
        matchingResult[1] +
        excludingResult[2];

      return { alt: patternMatch, prefixed: prefixedName, original: originalName, prefix: prefix };
    }
    return null;
  }

  grunt.registerMultiTask('rev', 'Prefix static asset file names with a content hash', function() {

    var options = this.options({
      encoding: 'utf8',
      algorithm: 'md5',
      length: 8
    });

    var alt = [],
      patternMatches = [],
      patternMatchesMap = [];

    // Wrap alt object in array
    if (grunt.util.kindOf(options.alt) === 'object') {
      alt = [options.alt];
    } else if (grunt.util.kindOf(options.alt) === 'array') {
      alt = options.alt;
    }

    // Find files matching pattern
    var tmpMatches;
    alt.forEach(function (altObj) {
      tmpMatches = grunt.file.glob.sync(altObj.pattern);
      grunt.util.kindOf(tmpMatches);
      patternMatches = patternMatches.concat(tmpMatches);
      patternMatchesMap.push({
        altObj: altObj,
        matches: tmpMatches
      });
    });

    var prefixMap = {};
    this.files.forEach(function(filePair) {
      filePair.src.forEach(function(f) {
        if (patternMatches.indexOf(f) < 0) {
          var hash = md5(f, options.algorithm, 'hex', options.encoding),
            prefix = hash.slice(0, options.length),
            renamed = [prefix, path.basename(f)].join('.'),
            outPath = path.resolve(path.dirname(f), renamed);

          prefixMap[f] = prefix;
          grunt.verbose.ok().ok(hash);
          fs.renameSync(f, outPath);
          grunt.log.write(f + ' ').ok(renamed);
        } else {
          grunt.log.write(f + ' skipping alt version ').ok();
        }
      });
    });

    // Rename alt files based on prefixMap
    var fileMatch;
    patternMatchesMap.forEach(function (altMap) {
      altMap.matches.forEach(function (patternMatch) {
        fileMatch = findAndBuildMatch(altMap.altObj, patternMatch, prefixMap);
        if (fileMatch !== null) {
          fs.renameSync(fileMatch.alt, fileMatch.prefixed);
          grunt.log.write(fileMatch.alt + ' ').ok(fileMatch.prefixed);
        }
      });
    });
  });
};
