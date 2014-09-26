'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var changeCase = require('change-case');

var UmbracoGenerator = yeoman.generators.Base.extend({

  initializing: function () {

    //Read the Package JSON file
    this.pkg = require('../package.json');

    //Get the Umbraco name from text file
    //this.sourceRoot() - /app/templates folder
    var asciiArt = this.read(path.join(this.sourceRoot(), '/ascii/umbraco-text.txt'));

    //Ouput the Ascii Art
    console.log(chalk.green(asciiArt));

    //Add in some version info
    //TODO: Do a loop for contributors string (rather than hardcode array selection)
    console.log(chalk.white.bold('Version: ') + chalk.white(this.pkg.version ));
    console.log(chalk.white.bold('Author: ') + chalk.white(this.pkg.author.name ));
    console.log(chalk.white.bold('Contributors: ') + chalk.white(this.pkg.contributors[0].name + ' & ' + this.pkg.contributors[1].name + ' & ' + this.pkg.contributors[2].name));
    console.log(chalk.yellow("Hello there! Let's create an Umbraco Property Editor.\n"));

     // Have Yeoman greet the user.
    /*
    this.log(yosay(
      'Welcome to the legendary Umbraco generator!'
    ));
    */

  },

  prompting: function () {
    var done = this.async();

    //Ask the user options for the main editor (property editor)
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
        default:  'JSON'
      }
    ];


    //For each prompt answer, set it on the main object (this)
    //So we can use in writing or end functions
    this.prompt(prompts, function (props) {

      //Create a nested object of names
      this.names = {
        name:     props.name,
        alias:    changeCase.pascalCase(props.name),
        ctrl:     changeCase.pascalCase(props.name) + '.Ctrl',
        filenames: {
          concatJS: changeCase.pascalCase(props.name) + '.js',
          css:  changeCase.pascalCase(props.name) + '.css',
          ctrl: changeCase.pascalCase(props.name) + '.ctrl.js',
          less: changeCase.pascalCase(props.name) + '.less',
          view: changeCase.pascalCase(props.name) + '.html',
          test: changeCase.pascalCase(props.name) + '.ctrl.spec.js',
        },
        subgenerators: {
          controller: changeCase.pascalCase(props.name) + '.Ctrl.',
          filter:     changeCase.pascalCase(props.name) + '.Filter.',
          directive:  changeCase.pascalCase(props.name) + '.Directive.',
          service:    changeCase.pascalCase(props.name) + '.Service.'
        }
      }

      //Store the other properties
      this.author      = props.author;
      this.description = props.description;
      this.valueType   = props.valueType;

      //Create on JSON object to store all the config data for saving
      var configData = {
        names:        this.names,
        author:       this.author,
        description:  this.description,
        valueType:    this.valueType
      }

      //Let's store this info into config - yo-rc.json
      //So any subgenerators can fetch this info to help generate files for namespaces etc
      this.config.set('generatorAnswers', configData);
      this.config.save();

      done();
    }.bind(this));
  },

  writing: {
    app: function () {

      //Create Folders
      this.dest.mkdir('app/scripts/controllers');
      this.dest.mkdir('app/scripts/directives');
      this.dest.mkdir('app/scripts/filters');
      this.dest.mkdir('app/scripts/services');
      this.dest.mkdir('app/styles');
      this.dest.mkdir('app/views');
      this.dest.mkdir('config');


      //Template npm package & bower json files
      this.template('_package.json', 'package.json');
      this.template('_bower.json', 'bower.json');

      //Template generic files (Readme, gitignore etc)
      this.template('README.md', 'README.md');
      this.template('LICENSE.txt', 'LICENSE');
      this.template('gitignore.txt', '.gitignore');
      this.template('gruntfile.js', 'gruntfile.js');
      
    },

    projectfiles: function () {

      //Copy & template the basic LESS, HTML View, JS Controller & package.manifest to register with Umbraco
      this.template('config/package.manifest.txt', 'config/package.manifest');
      this.template('scripts/name.ctrl.js', 'app/scripts/controllers/' + this.names.filenames.ctrl);
      this.template('styles/name.less.txt', 'app/styles/' + this.names.filenames.less);
      this.template('views/name.html', 'app/views/' + this.names.filenames.view);

    },

    testfiles: function() {

      //Create the test folder/s
      this.dest.mkdir('test/specs');

      //COPY: Files specific for test setup
      this.src.copy('test/karma.conf.js', 'test/karma.conf.js');
      this.src.copy('test/app.conf.js', 'test/app.conf.js');

      //TEMPLATE: controller test setup
      this.template('test/specs/name.controller.spec.js', 'test/specs/' + this.names.filenames.test);

    }
  },

  end: function () {

    //If the option --skip-instal is NOT present then install dependencies from NPM & Bower
    if (!this.options['skip-install']) {

        console.log(chalk.magenta('Installing npm & bower dependencies'));

        //Install anything in packages.json from NPM
        //Along with anything from Bower in bower.json
        this.installDependencies();
      }
  }

});

module.exports = UmbracoGenerator;
