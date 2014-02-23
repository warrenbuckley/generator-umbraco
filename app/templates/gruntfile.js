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

        //Less CSS
        less: {
            development: {
                options: {
                    sourceMap: true
                },
                files: {
                    "path/to/result.css": "path/to/source.less"
                }
            },
            production: {
                options: {
                    cleancss: true
                },
                files: {
                    "path/to/result.css": "path/to/source.less"
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
                tasks: ['less:development'],    //Run the Less task to compile into CSS with SourceMaps
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

        //Assembly Info - we can get DLL version to match
        //TODO: Configure properly (As Default from npm proj page)
        assemblyinfo: {
            options: {
                // Can be solutions, projects or individual assembly info files
                files: ['src/MyProject/MyProject.csproj'],

                // Filename to search for when a solution or project is 
                // specified above. Default is AssemblyInfo.cs.
                filename: 'VersionInfo.cs', 

                // Standard assembly info
                info: {
                    title: 'Planet Express Website', 
                    description: 'Shipping and tracking website.', 
                    configuration: 'Release', 
                    company: 'Planet Express', 
                    product: 'Planet Express Website', 
                    copyright: 'Copyright 3002 © Planet Express', 
                    trademark: 'Planet Express',
                    version: '2.0', 
                    fileVersion: '2.0.3.2345'
                }
            }
        },

        //MSBuild - Run & Compile our code into a DLL
        //TODO: Configure properly - defualt from NPM package page
        msbuild: {
            dev: {
                src: ['ConsoleApplication5.csproj'],
                options: {
                    projectConfiguration: 'Debug',
                    targets: ['Clean', 'Rebuild'],
                    stdout: true,
                    maxCpuCount: 4,
                    buildParameters: {
                        WarningLevel: 2
                    },
                    verbosity: 'quiet'
                }
            }
        },

        //Auto package up as a NuGet package
        //TODO: Again default from NPM package page
        nugetpack: {
            dist: {
                src: '<%= package_temp_dir %>/nuget/package.nuspec',
                dest: '<%= package_dir %>'
            }
        },


        //Automatically creates as an Umbraco .zip file
        //TODO: Uses default config from NPM page
        umbracoPackage: {
            options: {
                name: "Your Package Name",                // You can also use templates if you manage this data elsewhere in your project
                version: '<%= pkg.version %>',            // like so
                url: 'http://www.google.com',
                license: 'MIT',
                licenseUrl: 'http://opensource.org/licenses/MIT',
                author: '',
                authorUrl: '',    
                manifest: 'pkg/umbraco/package.xml',    // File containing your package manifest template
                readme: 'pkg/umbraco/readme.txt',        // Optional text file to insert into the package manifest's <readme> field
                sourceDir: 'pkg/tmp/umbraco',            // Directory that contains the files to be packaged, in the desired folder structure (ie, including "App_Plugins/YourName/".  You can generate this with a copy task if needed.
                outputDir: 'pkg',                        // Directory to place the generated package file
            }
        },


        //Clean folders
        //TODO: Default from npm project page
        clean: {
            build: ["path/to/dir/one", "path/to/dir/two"],
            release: ["path/to/another/dir/one", "path/to/another/dir/two"]
        },


    });

    // 3. Where we tell Grunt we plan to use this plug-in.

    //Concat JS Files
    grunt.loadNpmTasks('grunt-contrib-concat');

    //Minify JS files - aka Uglify
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //Minify image files
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    //Less to css compilation
    grunt.loadNpmTasks('grunt-contrib-less');

    //Auto-Watch folders/files for changes on save. Re-runs tasks
    grunt.loadNpmTasks('grunt-contrib-watch');

    //Built in web server - so we can preview our index page
    grunt.loadNpmTasks('grunt-contrib-connect');

    //Update DLL with version info
    grunt.loadNpmTasks('grunt-dotnet-assembly-info');

    //Run MSBuild - This will compile/build out our DLL
    grunt.loadNpmTasks('grunt-msbuild');

    //Autobuild our package as a NuGet package
    grunt.loadNpmTasks('grunt-nuget');

    //Autobuild our package as an Umbraco ZIP package
    grunt.loadNpmTasks('grunt-umbraco-package');

    //Clean folders
    grunt.loadNpmTasks('grunt-contrib-clean');



    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    //We will run concat first followed by JS minify (aka Uglify), then imagemin...
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin', 'connect', 'watch']);

};