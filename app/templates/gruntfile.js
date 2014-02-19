module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        //Configuration for concatinating files goes here
        concat: {   
            dist: {
                src: [
                    'js/libs/*.js', // All JS in the libs folder
                    'js/global.js'  // This specific file
                    ],
                dest: 'js/build/production.js',
            }
        },

        //Configuration for minifying JS files goes here (aka Uglify)
        uglify: {
            build: {
                src: 'js/build/production.js',      //The JS from the concatanation file above
                dest: 'js/build/production.min.js'  //The output file we will save it out to
            }
        },

        //Minify image file sizes
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'imgs/build/'
                }]
            }
        },

        //Sass
        sass: {
            dist: {
                options: {
                    style: 'compressed'                     //Compress CSS file (aka minify)
                },
                files: {
                    'css/build/main.css': 'css/main.scss'   //Destination file: Source Sass File
                }
            } 
        },

        //Auto watch files/folders for fiel changes & run set tasks above
        watch: {

            //Setup config options for watch
            options: {
                livereload: true,               //Enable the liverelaod browser plugin
            },

            //This is just for JS Scripts
            scripts: {
                files: ['js/*.js'],             //Monitor files in the js folder with the js extension
                tasks: ['concat', 'uglify'],    //Run the JS concat followed by the minify aka uglify task
                options: {
                    spawn: false,               //Don't fully understand this switch but its needed
                }
            },

            //This is for the CSS/Sass auto compilation
            css: {
                files: ['css/*.scss'],          //Monitor files in the css folder with the .scss extension
                tasks: ['sass'],                //Run the Sass task to compile & minify into CSS
                options: {
                    spawn: false,               //Don't fully understand this switch but its needed
                }
            }
        },

        //Web server task
        connect: {
            server: {
                options: {
                    port: 9001,             //The port number we will run on
                    base: '.',              //The root folder
                    livereload: true,       //Auto inject the live-reload JS needed
                    open: true              //Auto open the browser to our server we fired up
                }
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.

    //Concat JS Files
    grunt.loadNpmTasks('grunt-contrib-concat');

    //Minify JS files - aka Uglify
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //Minify image files
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    //Sass to css compilation
    grunt.loadNpmTasks('grunt-contrib-sass');

    //Auto-Watch folders/files for changes on save. Re-runs tasks
    grunt.loadNpmTasks('grunt-contrib-watch');

    //Built in web server - so we can preview our index page
    grunt.loadNpmTasks('grunt-contrib-connect');


    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    //We will run concat first followed by JS minify (aka Uglify), then imagemin...
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin', 'connect', 'watch']);

};