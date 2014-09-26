module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  require('grunt-karma')(grunt);

  //cant load this with require
  grunt.loadNpmTasks('grunt-contrib-jshint');

  if (grunt.option('target') && !grunt.file.isDir(grunt.option('target'))) {
    grunt.fail.warn('The --target option specified is not a valid directory');
  }
    
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dest: grunt.option('target') || 'dist',
    basePath: 'App_Plugins/<%%= pkg.name %>',

    concat: {
      dist: {
        src: [
          'app/scripts/controllers/*.js',
          'app/scripts/directives/*.js',
          'app/scripts/filters/*.js',
          'app/scripts/services/*.js'
        ],
        dest: '<%%= dest %>/<%%= basePath %>/js/<%= names.filenames.concatJS %>',
        nonull: true
      }
    },

    less: {
      dist: {
        options: {
          paths: ['app/styles'],
        },
        files: {
          '<%%= dest %>/<%%= basePath %>/css/<%= names.filenames.css %>': 'app/styles/<%= names.filenames.less %>',
        }
      }
    },

    watch: {
      options: {
        atBegin: true
      },

      less: {
        files: ['app/styles/**/*.less'],
        tasks: ['less:dist']
      },

      js: {
        files: ['app/scripts/**/*.js'],
        tasks: ['concat:dist']
      },

      testControllers: {
        files: ['app/scripts/controllers/*.js', 'test/specs/**/*.spec.js'],
        tasks: ['jshint', 'test']
      },

      html: {
        files: ['app/views/**/*.html'],
        tasks: ['copy:views']
      },

      config: {
        files: ['config/package.manifest'],
        tasks: ['copy:config']
      }
    },

    copy: {
      config: {
        src: 'config/package.manifest',
        dest: '<%%= dest %>/<%%= basePath %>/package.manifest',
      },

      views: {
        expand: true,
        cwd: 'app/views/',
        src: '**',
        dest: '<%%= dest %>/<%%= basePath %>/views/'
      },

      testAssets: {
        expand: true,
        cwd: '<%%= dest %>',
        src: ['js/umbraco.*.js', 'lib/**/*.js'],
        dest: 'test/assets/'
      }
    },

    clean: {
      dist: '<%= dest %>',
      test: 'test/assets'
    },

    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    },

    jshint: {
      dev: {
        files: {
          src: ['app/scripts/**/*.js']
        },
        options: {
          curly: true,
          eqeqeq: true,
          immed: true,
          latedef: true,
          newcap: true,
          noarg: true,
          sub: true,
          boss: true,
          eqnull: true,
          //NOTE: we need to use eval sometimes so ignore it
          evil: true,
          //NOTE: we need to check for strings such as "javascript:" so don't throw errors regarding those
          scripturl: true,
          //NOTE: we ignore tabs vs spaces because enforcing that causes lots of errors depending on the text editor being used
          smarttabs: true,
          globals: {}
        }
      }
    }
  });

  //Default Grunt task - call with just 'grunt'
  //JsHint, concacts JS, Compiles Less, copy package.manifest & copy HTML editor views
  grunt.registerTask('default', ['jshint', 'concat', 'less', 'copy:config', 'copy:views']);
 
  //Test Task - call with 'grunt test'  
  grunt.registerTask('test', 'Clean, copy test assets, test', function () {

    var assetsDir = grunt.config.get('dest');

    //copies over umbraco assets from --target, this must point at the /umbraco/ directory
    if (assetsDir !== 'dist') {

      grunt.task.run(['clean:test', 'copy:testAssets', 'karma']);

    } else if (grunt.file.isDir('test/assets/js/')) {

      grunt.log.oklns('Test assets found, running tests');
      grunt.task.run(['karma']);

    } else {

      grunt.log.errorlns('Tests assets not found, skipping tests');
    }

  });
};
