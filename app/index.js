'use strict';
var util    = require('util');
var path    = require('path');
var yeoman  = require('yeoman-generator');
var chalk   = require('chalk');


var UmbracoGenerator = yeoman.generators.Base.extend({

  //Initialise the Yo Generator
  init: function () {
    //Get info from package.json & store it
    this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

    //Wire up an event when the Yo Generator Ends...
    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.npmInstall();
      }
    });
  },

  //Ask the user some questions....
  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    console.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    console.log(chalk.yellow('Hello there! Let\'s start creating Umbraco property editors.'));

    //TODO: Get Author Name & URL from this package.json
    console.log(chalk.green('Version:') + chalk.cyan(this.pkg.version));
    console.log(chalk.green('Author:') + chalk.cyan(this.pkg.author.name));
    console.log(chalk.green('Web:') + chalk.cyan(this.pkg.author.url));
    
    //Empty line between version info above & the questions
    console.log('');

    //Buddha Art
    //TODO

    //Questions/Prompts we ask our user
    var prompts = [
      {
        name: 'developerName',
        message: 'What is your name?',
        default: 'Umbraco Developer'
      },
      {
        name: 'propertyTypeAlias',
        message: 'Property Type Alias (Remember has to be unique)',
        default: 'GoogleMaps'
      },
      {
        name: 'propertyTypeName',
        message: 'Property Type Name (This is the friendly name)',
        default: 'Google Maps'
      },
      {
        type: 'list',
        name: 'propertyTypeValue',
        message: 'How do you want to save your data as?',
        choices: [ 'JSON', 'STRING', 'DATETIME', 'INT' ],
        default: 'JSON'
      }
    ];

    this.prompt(prompts, function (props) {

      //Get the values the user answered & store them
      this.developerName      = props.developerName;
      this.propertyTypeAlias  = props.propertyTypeAlias;
      this.propertyTypeName   = props.propertyTypeName;
      this.propertyTypeValue  = props.propertyTypeValue;

      done();
    }.bind(this));
  },

  //This function stubs out the application
  app: function () {
    this.mkdir('app');
    this.mkdir('app/templates');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
  },

  //This function copies & stubs out any project files
  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = UmbracoGenerator;