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

  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    /*
    this.log(yosay(
      'Welcome to the legendary Umbraco generator!'
    ));
    */

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;

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
