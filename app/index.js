'use strict';

var util       = require('util');
var path       = require('path');
var yeoman     = require('yeoman-generator');
var chalk      = require('chalk');
var changeCase = require('change-case');

var UmbracoGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        console.log(chalk.green('Installing npm dependencies'));
        process.chdir(this.names.alias);
        this.npmInstall();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    //Umbraco ASCII Art
    var ascii = this.readFileAsString(path.join(this.sourceRoot(), '/ascii/umbraco-text.txt'));
    console.log(chalk.green(ascii));

    //Add in some version info
    console.log(chalk.green('Version: ' + this.pkg.version ));
    console.log(chalk.green('Author: ' + this.pkg.author.name ));
    console.log(chalk.green('Contributors: ' + this.pkg.contributors[0].name + ' & ' + this.pkg.contributors[1].name));

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
        message:  'Author',
        default:  this.user.git.username || 'Warren Buckley'
      },
      {
        name:     'template',
        message:  'Do you wish to use a template to help you?',
        type:     'list',
        choices: [
          {
            name: "No thanks I am fine",
            value: "basic"
          },
          {
            name: "Google Maps",
            value: "google-maps"
          }
        ]
      },
      {
        name:     'valueType',
        message:  'What type of data will you be storing?',
        type:     'list',
         choices: [
          {
            name: "JSON",
            value: "JSON"
          },
          {
            name: "String",
            value: "STRING"
          },
          {
            name: "Text",
            value: "TEXT"
          },
          {
            name: "Date Time",
            value: "DATETIME"
          },
          {
            name: "Integer",
            value: "INT"
          }
        ],
        when: function(answers) {
          return answers.template === "basic";
        },
        default:  'JSON'
      }
    ];

    this.prompt(prompts, function(props) {

      this.names = {
        name:     props.name,
        alias:    changeCase.pascalCase(props.name),
        ctrl:     changeCase.pascalCase(props.name) + 'Controller',
        css:      changeCase.paramCase(props.name),
        file:     changeCase.dotCase(props.name),
        template: changeCase.paramCase(props.template)
      }

      this.author      = props.author;
      this.description = props.description;
      this.valueType   = props.valueType;

      //Log template type
      console.log(this.names.template);


      done();

    }.bind(this));
  },

  app: function () {
    //Read package.manifest JSON (So we can loop over them in the HTML view markup)
    this.pkgmanifest  = yeoman.file.readJSON(path.join(__dirname,'templates/' , this.names.template ,'/config/package.manifest'));
    this.prevalues    = this.pkgmanifest.propertyEditors[0].prevalues.fields;

    //Create Directories
    this.mkdir(this.names.alias);
    this.mkdir(this.names.alias + '/app/scripts/controllers');
    this.mkdir(this.names.alias + '/app/styles');
    this.mkdir(this.names.alias + '/app/views');
    this.mkdir(this.names.alias + '/config');

    //Template: Common files
    this.template('README.md',      this.names.alias + '/README.md');
    this.template('LICENSE',        this.names.alias + '/LICENSE');
    this.template('gitignore',      this.names.alias + '/.gitignore');
    this.template('_package.json',  this.names.alias + '/package.json');
    this.template('Gruntfile.js',   this.names.alias + '/Gruntfile.js');
    
    //Template: Files specific to template type (/basic/app/views/name.html ...)
    this.template(this.names.template + '/app/views/name.html',                          this.names.alias + '/app/views/' + this.names.file + '.html');
    this.template(this.names.template + '/app/scripts/controllers/name.controller.js',   this.names.alias + '/app/scripts/controllers/' + this.names.file + '.controller.js');
    this.template(this.names.template + '/app/styles/name.less',                         this.names.alias + '/app/styles/' + this.names.file + '.less');
    this.template(this.names.template + '/config/package.manifest',                      this.names.alias + '/config/package.manifest');

    //Copy Files: No param's need replacing
    this.copy('config/_package.nuspec',  this.names.alias + '/config/package.nuspec');
    this.copy('config/_package.xml',     this.names.alias + '/config/package.xml');
    this.copy('config/readme.txt',       this.names.alias + '/config/readme.txt');
    
  }
});

module.exports = UmbracoGenerator;

