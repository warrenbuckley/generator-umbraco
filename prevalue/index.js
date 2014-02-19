'use strict';
var util 	= require('util');
var yeoman 	= require('yeoman-generator');


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
        name: 'prevalueAlias',
        message: 'Prevalue Alias',
        default: 'myPrevalue'
      },
      {
        name: 'prevalueDescription',
        message: 'Description',
        default: 'This is a prevalue'
      },
      {
        name: 'prevalueKey',
        message: 'Prevalue Key',
        default: 'myPreValueField'
      },
      {
        name: 'prevalueView',
        message: 'Prevalue View',
        default: 'boolean'
      }
    ];

    this.prompt(prompts, function (props) {

      //Get the values the user answered & store them
      this.prevalueAlias  		  = props.prevalueAlias.replace(' ','.'); //Replace spaces with dots in the alias
      this.prevalueDescription  = props.prevalueDescription;
      this.prevalueKey  		    = props.prevalueKey;
      this.prevalueView         = props.prevalueView;

      done();
    }.bind(this));
  },

  updateJson: function () {
  	//Load the package.manifest JSON file

  	//If file does not exist - throw an error
  }
});

module.exports = PrevalueGenerator;