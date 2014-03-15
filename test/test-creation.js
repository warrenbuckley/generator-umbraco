/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('umbraco generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('umbraco:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'Archetype/.gitignore',
      'Archetype/package.json',
      'Archetype/Gruntfile.js',
      'Archetype/app/views/archetype.html',
      'Archetype/app/scripts/controllers/archetype.controller.js',
      'Archetype/app/styles/archetype.less',
      'Archetype/config/package.manifest',
      'Archetype/config/package.nuspec',
      'Archetype/config/package.xml',
      'Archetype/config/readme.txt'
    ];

    helpers.mockPrompt(this.app, {
      'name': 'Archetype',
      'template': 'basic'
    });

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
