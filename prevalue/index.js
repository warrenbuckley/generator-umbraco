'use strict';
var util 	  = require('util');
var path    = require('path');
var yeoman 	= require('yeoman-generator');
var chalk   = require('chalk');


var PrevalueGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    console.log(chalk.yellow('You called the prevalue subgenerator with the argument ' + this.name + '.'));
  },

  //Ask the user some questions....
  askFor: function () {
  	var done = this.async();

    // have Yeoman greet the user
    console.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    console.log(chalk.yellow('Hello there! Let\'s add your prevalue to the prtoperty editor.'));

    //Questions/Prompts we ask our user
    var prompts = [
      {
        name: 'prevalueLabel',
        message: 'Label',
        default: 'myPrevalue'
      },
      {
        name: 'prevalueDescription',
        message: 'Description',
        default: 'This is a prevalue'
      },
      {
        name: 'prevalueKey',
        message: 'Key',
        default: 'myPreValueField'
      },
      {
        name: 'prevalueView',
        message: 'View',
        default: 'boolean'
      }
    ];

    this.prompt(prompts, function (props) {

      //Get the values the user answered & store them
      this.prevalueLabel  		  = props.prevalueLabel.replace(' ','.'); //Replace spaces with dots in the alias
      this.prevalueDescription  = props.prevalueDescription;
      this.prevalueView         = props.prevalueView;
      this.prevalueKey          = this.name.replace(' ','.'); //The param we passed into the  

      done();
    }.bind(this));
  },

  updateJson: function () {

    //This subgenerator needs to be run inside app_plugins/propertyName/ so we can get the package.manifest

  	//Load the package.manifest JSON file
    this.packagemanifest = yeoman.file.readJSON('package.manifest');

    //Create our JSON item we need to push into the array
    /*
    {
        label: "Number of columns",
        description: "Enter the number of columns",
        key: "cols",
        view: "number"
    }
    */
    var prevalueToAdd = {
      "label": this.prevalueLabel,
      "description": this.prevalueDescription,
      "key": this.prevalueKey,
      "view": this.prevalueView 
    };

    //Load in the prevalues item
    var prevalues = this.packagemanifest.propertyEditors[0].prevalues;
    var fields    = prevalues.fields;

    //DEBUG
    //console.log(prevalues);
    //console.log(fields);


    //Push our new item into the JSON
    //prevalues --> fields array
    fields.push(prevalueToAdd);

    //DEBUG - See if prevalue has been added
    //console.log(prevalues);
    //console.log(fields);

    //Write the updated JSON back down to disk
    //TODO: IS there a way to force overwrite automatically?
    this.write('package.manifest',JSON.stringify(this.packagemanifest));

  }
});

module.exports = PrevalueGenerator;