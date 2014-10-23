'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var UmbracoGenerator = yeoman.generators.NamedBase.extend({
  initializing: function () {

    //Get value from config - yo-rc.json
    var configData = this.config.get('generatorAnswers');

    //A flag to check for errors
    this.hasErrors = false;

    //If config value empty or null - USER is very unlikely not ran main generator
    //WARN/PROMPT THEM TO DO SO
    if(!configData){
    	this.log(chalk.red('No config data found. Please ensure you run yo umbraco first before calling yo umbraco:controller'));
    	
      //Set our flag to true
      //If we was to do a return here - we just exit the init function not the writing function below
      this.hasErrors = true;
    }
    else {
      //Set the names from our configData for templating if needed
      this.names = configData.names;

      //Get the Prefix & the name
      this.controllerName     = configData.names.subgenerators.controller + this.name;
      this.controllerFileName = configData.names.subgenerators.controller + this.name + '.js';
    }

  },

  writing: function () {

    //Only copy & template file if there are no erros
    if(!this.hasErrors){

      this.log(chalk.green('Create a new controller: ' + this.controllerName));

      //Copy & template controller file
      this.template('name.controller.js', 'app/scripts/controllers/' + this.controllerFileName);
    }
  }
});

module.exports = UmbracoGenerator;
