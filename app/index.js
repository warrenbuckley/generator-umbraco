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

        console.log(chalk.green('Installing npm dependencies'));
        this.npmInstall();
      }

      //All Done...
      //Buddha Ascii Art
      var buddha = this.readFileAsString(path.join(this.sourceRoot(), 'buddha.txt'));
      console.log(chalk.green(buddha));

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

    //Questions/Prompts we ask our user
    var prompts = [
      {
        name: 'developerName',
        message: 'What is your name?',
        default: 'Joe Bloggs'
      },
      {
        name: 'propertyTypeAlias',
        message: 'Property Type Alias (Remember has to be unique)',
        default: 'MyFirst.PropertyEditor'
      },
      {
        name: 'propertyTypeName',
        message: 'Property Type Name (This is the friendly name)',
        default: 'My First Property Editor'
      },
      {
        type: 'list',
        name: 'propertyTypeValue',
        message: 'How do you want to save your data as?',
        choices: [ 'JSON', 'STRING', 'TEXT', 'DATETIME', 'INT' ],
        default: 'JSON'
      }
    ];

    this.prompt(prompts, function (props) {

      //Get the values the user answered & store them
      this.developerName      = props.developerName;
      this.propertyTypeAlias  = props.propertyTypeAlias;
      this.propertyTypeName   = props.propertyTypeName;
      this.propertyTypeValue  = props.propertyTypeValue;

      //Check we have a value, not null or undenfied
      if(!props.propertyTypeAlias)
      {
        this.propertyTypeAlias = props.propertyTypeAlias.replace(' ','.'); //Replace spaces with dots in the alias
      }

      //Build Up the Controller Name
      this.controllerName = this.propertyTypeAlias + '.controller';

      //This is the folder name /app_plugins/MyFirst.PropertyEditor
      this.folderName = 'app_plugins/' + this.propertyTypeAlias;

      done();
    }.bind(this));
  },

  //This function stubs out the application
  app: function () {

    console.log(chalk.green('Creating App'));

    //Create the app_plugins folder at the root of this command
    this.mkdir('app_plugins');

    //Create the property editor folder
    this.mkdir(this.folderName);
  },

  //Copy bower, grunt & package.json files over
  workflowfiles: function() {

    console.log(chalk.green('Creating Workflow items'));

    this.template('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('gruntfile.js', 'gruntfile.js');
  },

  umbracofiles: function() {

    console.log(chalk.green('Creating Umbraco Files'));

    //Copy & Template the HTML view
    this.template('index.html', this.folderName + '/index.html');

    //Copy & Template the JS controller
    this.template('controller.js', this.folderName + '/js/' + this.propertyTypeAlias +'.js');

    //Copy Less Source Dependancy Files (Grunt will build to single file)
    //Would prefer Sass but depends on ruby & no way to check :(
    //But Less can be installed via npm
    this.copy('propertyeditor.less', this.folderName + '/css/' + this.propertyTypeAlias +'.less');

    //Copy any JS Source Depednacy Files (Grunt will build to single file)
    //None in this GoogleMaps Example is needed

    //Copy & Template the package.manifest to the app_plugins
    this.template('package.manifest', this.folderName + '/package.manifest');
  }
  

});

module.exports = UmbracoGenerator;