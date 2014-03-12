module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dest: grunt.option('target') ? grunt.option('target') : 'dist',
    basePath: 'App_Plugins/<%%= pkg.name %>',

    concat: {
      dist: {
        src: [
          'app/scripts/controllers/<%= names.file %>.controller.js'
        ],
        dest: '<%%= dest %>/<%%= basePath %>/js/<%= names.file %>.js',
        nonull: true
      }
    },

    less: {
      dist: {
        options: {
          paths: ["app/styles"],
        },
        files: {
          '<%%= dest %>/<%%= basePath %>/css/<%= names.file %>.css': 'app/styles/<%= names.file %>.less',
        }
      }
    },

    watch: {
      less: {
        files: ['app/styles/**/*.less'],
        tasks: ['less:dist'],
        options: {
          spawn: false
        }
      },

      js: {
        files: ['app/scripts/**/*.js'],
        tasks: ['concat:dist'],
        options: {
          spawn: false
        }
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

      nuget: {
        expand: true,
        cwd: '<%%= dest %>',
        src: '**',
        dest: 'tmp/nuget/content/'
      },

      umbraco: {
        expand: true,
        cwd: '<%%= dest %>/',
        src: '**',
        dest: 'tmp/umbraco/'
      }
    },

    template: {
      nuspec: {
        options: {
          data: {
            name:        '<%%= pkg.name %>',
            version:     '<%%= pkg.version %>',
            author:      '<%%= pkg.author.name %>',
            description: '<%%= pkg.description %>'
          }
        },
        files: {
          'tmp/nuget/<%%= pkg.name %>.nuspec': 'config/package.nuspec'
        }
      }
    },

    mkdir: {
      pkg: {
        options: {
          create: ['pkg/nuget', 'pkg/umbraco']
        },
      },
    },

    nugetpack: {
      dist: {
        src: 'tmp/nuget/<%%= pkg.name %>.nuspec',
        dest: 'pkg/nuget/'
      }
    },

    umbracoPackage: {
      options: {
        name:        '<%%= pkg.name %>',
        version:     '<%%= pkg.version %>',
        url:         '<%%= pkg.url %>',
        license:     '<%%= pkg.license %>',
        licenseUrl:  '<%%= pkg.licenseUrl %>',
        author:      '<%%= pkg.author %>',
        authorUrl:   '<%%= pkg.authorUrl %>',
        manifest:    'config/package.xml',
        readme:      'config/readme.txt',
        sourceDir:   'tmp/umbraco',
        outputDir:   'pkg/umbraco',
      }
    },

    clean: {
      dist: '<%%= dest %>'
    }
  });

  grunt.registerTask('default', ['concat', 'less', 'copy:config', 'copy:views']);
  grunt.registerTask('nuget', ['clean', 'default', 'copy:nuget', 'template:nuspec', 'mkdir:pkg', 'nugetpack']);
  grunt.registerTask('umbraco', ['clean', 'default', 'copy:umbraco', 'mkdir:pkg', 'umbracoPackage']);
};

