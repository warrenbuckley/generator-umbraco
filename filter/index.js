'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var UmbracoGenerator = yeoman.generators.NamedBase.extend({
  initializing: function () {

    this.log(chalk.green('Create a new filter: ' + this.name));

    //Get value from config - yo-rc.json
    var configData = this.config.get('generatorAnswers');

    //If config value empty or null - USER is very unlikely not ran main generator
    //WARN/PROMPT THEM TO DO SO
    if(!configData){
    	this.log(chalk.bgRed('No config data found. Please ensure you run yo umbraco first before calling yo umbraco:filter'));
    	return;
    }

  },

  writing: function () {
  	this.template('name.filter.js', 'app/scripts/filters/' + this.name + '.filter.js');
  }
});

module.exports = UmbracoGenerator;
