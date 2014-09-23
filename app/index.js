'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

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
    console.log(chalk.green('Version: ' + this.pkg.version ));
    console.log(chalk.green('Author: ' + this.pkg.author.name ));
    console.log(chalk.green('Contributors: ' + this.pkg.contributors[0].name + ' & ' + this.pkg.contributors[1].name + ' & ' + this.pkg.contributors[2].name));
    console.log(chalk.yellow("Hello there! Let's create an Umbraco Property Editor.\n"));

     // Have Yeoman greet the user.
    /*
    this.log(yosay(
      'Welcome to the legendary Umbraco generator!'
    ));
    */

  },

  prompting: function () {
    ar done = this.async();

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


    //For each prompt answer, set it on the main object (this)
    //So we can use in writing or end functions
    this.prompt(prompts, function (props) {

      //Create a nested object of names
      this.names = {
        name:     props.name,
        alias:    changeCase.pascalCase(props.name),
        ctrl:     changeCase.pascalCase(props.name) + 'Ctrl',
        less:     changeCase.pascalCase(props.name) + '.less',
        css:      changeCase.paramCase(props.name) + '.css',
        view:     changeCase.paramCase(props.name) + '.html',
        file:     changeCase.dotCase(props.name),
        template: changeCase.paramCase(props.template)
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
      this.dest.mkdir('app');
      this.dest.mkdir('app/templates');

      this.src.copy('_package.json', 'package.json');
      this.src.copy('_bower.json', 'bower.json');
    },

    projectfiles: function () {
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');
    },

    testfiles: function() {

      console.log('Writing test files');

      //Create the test folder/s
      this.dest.mkdir(this.names.alias + '/test/specs');

      //COPY: Files specific for test setup
      this.src.copy('test/karma.conf.js', this.names.alias + '/test/karma.conf.js');
      this.src.copy('test/app.conf.js', this.names.alias + '/test/app.conf.js');

      //TEMPLATE: controller test setup
      this.template('test/specs/name.controller.spec.js',   this.names.alias + '/test/specs/' + this.names.ctrl + '.spec.js');

    }
  },

  end: function () {

    //If the option --skip-instal is NOT present then install dependencies from NPM & Bower
    if (!this.options['skip-install']) {

        console.log(chalk.green('Installing npm & bower dependencies'));

        //Install anything in packages.json from NPM
        //Along with anything from Bower in bower.json
        this.installDependencies();
      }
  }

});

module.exports = UmbracoGenerator;
