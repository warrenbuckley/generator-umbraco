module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
          'app/scripts/controllers/<%= names.file %>.controller.js'
        ],
        dest: 'dist/js/<%= names.file %>.js',
        nonull: true
      }
    },

    less: {
      dist: {
        options: {
          paths: ["app/styles"],
        },
        files: {
          'dist/css/<%= names.file %>.css': 'app/styles/<%= names.file %>.less',
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
        dest: 'dist/package.manifest',
      },

      views: {
        expand: true,
        cwd: 'app/views/',
        src: '**',
        dest: 'dist/views/'
      }
    },

    clean: {
      dist: 'dist'
    }
  });

  grunt.registerTask('default', ['concat', 'less', 'copy']);
};

