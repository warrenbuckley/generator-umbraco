# generator-umbraco [![Build Status](https://secure.travis-ci.org/warrenbuckley/generator-umbraco.png?branch=master)](https://travis-ci.org/warrenbuckley/generator-umbraco) [![Stories in Ready](https://badge.waffle.io/warrenbuckley/generator-umbraco.png?label=ready&title=Ready)](https://waffle.io/warrenbuckley/generator-umbraco)

> [Yeoman](http://yeoman.io) generator

## Note: This is a work in progress currently & I am ironing out a few things

## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
$ npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-umbraco from npm, run:

```
$ npm install -g generator-umbraco
```

Finally, initiate the generator:

```
$ yo umbraco
```

The friendly YeoMan will ask you some questions about creating your Umbraco property editor and then go off and scaffold it all for you to start building your own Umbraco property editor.

To add a prevalue to the package.manifest is easy. Change the command window/console to the folder where the package.manifest lives and run the following command, where myPrevalueToAdd is the unique key of the prevalue you wish to add the package.manifest file.

YeoMan will ask his usual questions to help you add the prevalue to the package.manifest

```
yo umbraco:prevalue myPrevalueToAdd
```


## License

MIT
