# <%= names.name %>

<%= description %>

## Setup

### Install Dependencies

```bash
npm install -g grunt-cli, tsd
npm install
```

### Install typescript definitions

```bash
tsd install jquery --save
tsd install angularjs/ --save
```	

#### General Build
```
grunt
```

#### Build NuGet Package
```
grunt nuget
```

#### Build Umbraco Package
```
grunt package
```

#### Automatically watch & build files
This will monitor the Less, typescript & HTML files for you and build, concat & copy them as needed every time you save a file.
```
grunt watch
```

#### Test with an Umbraco Site
You can easily copy your property editor to an Umbraco site to test it out. This will copy the folder that gets run when calling grunt. You simply need to specify the root of the Umbraco site by specifiying a target switch.
```
grunt --target=c:\inetpub\wwwroot\my-umbraco-site\

or

grunt watch --target=c:\inetpub\wwwroot\my-umbraco-site\
```

#### Unit test your controller
Your property editor comes with a basic test setup for unit testing the editors controller. This is done with [Jasmine](http://jasmine.github.io/2.0/introduction.html) and [Karma](http://karma-runner.github.io/0.12/index.html)

To run your unit tests:
```
grunt test
```

**Notice**: To run unit tests you have to copy over all Umbraco's core javascript files. Which you can do by setting -target to point at your /umbraco/ directory, you only have to do this once.

```
grunt test --target=c:\inetpub\wwwroot\my-umbraco-site\umbraco
```