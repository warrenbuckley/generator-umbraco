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
    	this.log(chalk.red('No config data found. Please ensure you run yo umbraco first before calling yo umbraco:filter'));
    	
      //Set our flag to true
      //If we was to do a return here - we just exit the init function not the writing function below
      this.hasErrors = true;
    }
    else {
      //Set the names from our configData
      this.names = configData.names;

      //Get the Prefix & the name
      //AwesomePropertyEditor.Filter.LowerCase.js
      this.filterName = configData.names.subgenerators.filter + this.name + '.js';
    }

  },

  writing: function () {

    //Only copy & template file if there are no erros
    if(!this.hasErrors){

      this.log(chalk.green('Create a new filter: ' + this.name));

      //Copy & template filter file
      this.template('name.filter.js', 'app/scripts/filters/' + this.filterName);
    }
  }
});

module.exports = UmbracoGenerator;
