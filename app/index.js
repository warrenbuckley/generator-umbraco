'use strict';

var util   = require('util');
var path   = require('path');
var yeoman = require('yeoman-generator');
var chalk  = require('chalk');

var UmbracoGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        console.log(chalk.green('Installing npm dependencies'));
        this.npmInstall();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    console.log(this.yeoman);
    console.log(chalk.yellow("Hello there! Let's create an Umbraco Property Editor.\n"));

    var prompts = [
      {
        name:     'name',
        message:  'Name',
        default:  'Awesome Property Editor'
      },
      {
        name:     'description',
        message:  'Description',
        default:  'An Umbraco Property Editor'
      },
      {
        name:     'author',
        message:  'Author'
      },
      {
        name:     'valueType',
        message:  'What type of data will you be storing?',
        type:     'list',
        choices:  ['JSON', 'STRING', 'TEXT', 'DATETIME', 'INT'],
        default:  'JSON'
      }
    ];

    this.prompt(prompts, function(props) {
      this.names = {
        name:   props.name,
        alias:  props.name.replace(/\s+/g, ''),
        ctrl:   props.name.replace(/\s+/g, '') + 'Controller',
        css:    props.name.replace(/\s+/g, '-').toLowerCase(),
        file:   props.name.replace(/\s+/g, '.').toLowerCase()
      }

      this.author      = props.author;
      this.description = props.description;
      this.valueType   = props.valueType;

      done();

    }.bind(this));
  },

  app: function () {
    this.mkdir('app/scripts/controllers');
    this.mkdir('app/styles');
    this.mkdir('app/views');
    this.mkdir('config');

    this.template('gitignore', '.gitignore');
    this.template('_package.json', 'package.json');
    this.template('Gruntfile.js', 'Gruntfile.js');
    this.template('app/views/name.html', 'app/views/' + this.names.file + '.html');
    this.template('app/scripts/controllers/name.controller.js', 'app/scripts/controllers/' + this.names.file + '.controller.js');
    this.template('app/styles/name.less', 'app/styles/' + this.names.file + '.less');
    this.template('config/package.manifest', 'config/package.manifest');

    this.copy('config/_package.nuspec', 'config/package.nuspec');
  }
});

module.exports = UmbracoGenerator;

