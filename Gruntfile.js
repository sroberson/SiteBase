module.exports = function (grunt) {
    require("time-grunt")(grunt);
    // Project configuration.

    var output = grunt.option('output') || 'prod',
        canonical = grunt.option('canonical') || 'http://example.com';

    // usage:
    // grunt server
    // grunt package
    //                above will assume output of 'prod'
    //                and a canonical url of 'http://example.com'
    //
    // grunt server --output=prod --canonical=http://www.example.com/microsite_url
    // grunt server --output=qa --canonical=http://qawww.example.com/microsite_url
    // grunt package --output=qa --canonical=http://qawww.example.com/microsite_url


    var today = (function(){
        var zeroPad = function(num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        };

        var todayArr = [],
            todayRaw = new Date();
        todayArr.push(todayRaw.getFullYear());
        todayArr.push(todayRaw.getMonth()+1);
        todayArr.push(todayRaw.getDate());
        todayArr.push(zeroPad(todayRaw.getHours(), 2) + "." + zeroPad(todayRaw.getMinutes(), 2));
        return todayArr.join("-");
    })();

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        requirejs: {
            options: {
                mainConfigFile : "src/ui/scripts/main.js",
                baseUrl : "./src/ui/scripts",
                name: "main",
                dir: output + "/ui/scripts",
                removeCombined: true,
                paths: {
                    "addthis":      "empty:",
                    "limelight":    "empty:"
                },
                logLevel: 0,
                waitSeconds: 15,
                optimize: "uglify"
            },
            dev: {
                options: {
                    optimize: "none"
                }
            },
            prod: {
                options: {
                    optimize: "uglify"
                }
            }
        },

        less: {
            options: {
                paths: ["src/ui/less"],
                compress: true,
                yuicompress: true,
                optimization: 2
                // , cleancss: false // if true, removes src map info from file
                , sourceMap: true
                , sourceMapFilename: 'src/ui/css/styles.css.map' // where file is generated and located
                , sourceMapURL: 'styles.css.map' // the complete url and filename put in the compiled css file
                , outputSourceFiles: true
            },
            dev: {
                files: {
                    "src/ui/css/styles.css": "src/ui/less/styles.less"
                }
            },
            prod: {
                files: {
                    "src/ui/css/styles.css": "src/ui/less/styles.less"
                }
            }
        },

        jshint: {
            options: {
                browser: true,
                devel: true,
                noempty: true,
                plusplus: false,
                supernew: true,
                unused: false,
                evil: false,
                bitwise:true,
                freeze:false,
                laxcomma: true,
                nomen: true,
                debug: true,
                expr: true,
                newcap: true,
                validthis: true,

                globals: {
                    log: true,
                    define: true
                }
            },
            dev: {
                src: ["src/ui/scripts/**/*.js", "!src/ui/scripts/libs/**/*.js"]
            }
        },

        jslint: {
            dev: {
                src: ["src/ui/scripts/**/*.js", "!src/ui/scripts/libs/**/*.js"],
                options: {
                    edition: "latest",
                    errorsOnly: false
                },
                directives: {
                    browser: true,
                    devel: true,
                    evil: true,
                    nomen: true,
                    plusplus: true,
                    regexp: true,
                    unparam: true,
                    vars: true,
                    white: true,
                    globals: {
                        require: true,
                        define: true,
                        log: true,
                        Modernizr: true,
                        addthis: true,
                        LimelightPlayer: true,
                        LimelightPlayerUtil: true
                    }
                }
            }
        },

        copy: {
            src: {
                files: [
                    { expand: true, flatten: true, src: ['src/ui/vendor/modernizr/modernizr.js'], dest: 'src/ui/scripts/libs', filter: 'isFile' }
                    , { expand: true, flatten: true, src: ['src/ui/vendor/requirejs/require.js'], dest: 'src/ui/scripts/libs', filter: 'isFile' }
                    , { expand: true, flatten: true, src: ['src/ui/vendor/components-font-awesome/fonts/**'], dest: 'src/ui/fonts', filter: 'isFile' }
                ]
            },

            main: {
                files: [
                    {expand: true, flatten: true, src: ['src/ui/files/**'], dest: output + '/ui/files', filter: 'isFile'}
                    , {expand: true, flatten: true, src: ['src/ui/fonts/**'], dest: output + '/ui/fonts', filter: 'isFile'}
                    , {expand: true, flatten: true, src: ['src/ui/css/**'], dest: output + '/ui/css', filter: 'isFile'}
                    , {expand: true, flatten: true, src: ['src/*.html'], dest: output + '/', filter: 'isFile'}
                    , {expand: true, flatten: true, src: ['src/*.ico'], dest: output + '/', filter: 'isFile'}
                ]
            }
        },

        imagemin: {
            dynamic: {                         // Another target
                files: [{
                    expand: true,                       // Enable dynamic expansion
                    cwd: 'src/ui/images',               // Src matches are relative to this path
                    src: ['**/*.{jpg,png,gif,svg}'],    // Actual patterns to match
                    dest: output + '/ui/images'         // Destination path prefix
                }]
            }
        },

        //clean: [output],
        clean: {
            options: {force: true},
            target: [output + '/ui/css',
                output + '/ui/files',
                output + '/ui/fonts',
                output + '/ui/images',
                output + '/ui/scripts',
                output + '/ui/vendor'
            ],
            html: [output + '/*.html'],
            file: [output + '/ui/scripts/build.txt']
        },

        codekit: {
            dev: {
                src: ['src/codekit_src/*.kit'],
                dest: 'src'
            }
        },

        replace: {
            blankLines: {
                src: ['src/*.html'],             // source files array (supports minimatch)
                overwrite: true,
                replacements: [{
                    from: /^\s*$/gm, // /[\r\n]{2,}/, // removes beginning empty lines (either option works)
                    to: ''
                }]
            },
            canonical: {
                src: ['src/*.html'],             // source files array (supports minimatch)
                overwrite: true,
                replacements: [{
                    from: /@@CanonicalUrl@@/gm,
                    to: canonical
                }]
            }
        },

        watch: {
            options: {
                livereload: false
            },
            css: {
                files: ["src/ui/less/**/*.less", "src/ui/css/**/*.css", "!src/ui/css/styles.css", "!src/ui/css/styles.css.map"],
                tasks: ["less:dev"]
            },
            kit: {
                files: ['src/codekit_src/**/*.kit'],
                tasks: ['codekit:dev']
            },
            js: {
                files: ['src/ui/scripts/**/*.js', '!src/ui/scripts/libs/**/*.js'],
                tasks: ["jshint:dev", "jslint:dev"]
            }
        },

        cacheBust: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 5,
                ignorePatterns:['modernizr', 'oo_style'],
                enableUrlFragmentHint: true,
                filters: {
                    'script' : [
                        function() { return this.attribs['data-main']; }, // for requirejs mains.js
                        function() { return this.attribs['src']; }     // keep default 'src' mapper
                    ],
                    'link[rel="stylesheet"]' : function() { return this.attribs['href']; },
                    'img' : function() { return this.attribs['src']; },
                    'link[rel="icon"], link[rel="shortcut icon"]' : function() { return this.attribs['href']; }
                }
            },
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['*.html']
                }]
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: output,
                    src: ['*.html']
                }]
            }
        },

        // gzip assets 1-to-1 for production
        compress: {
            main: {
                options: {
                    pretty: true,
                    mode: 'zip',
                    archive: "ExampleCompany-" + output + "-" + today + '.zip'
                },
                expand: true,
                cwd: output + '/',
                src: ['**/*'],
                dest: '/'
            }
        },

        replaceWithFilename: {
            dev: {
                src: ['src/*.html'],
                dest: '/'
            }
        },

        notify: {
            task_name: {
                options: {
                    // Task-specific options go here.
                }
            },
            watch: {
                options: {
                    title: 'Task Complete',  // optional
                    message: 'SASS and Uglify finished running' //required
                }
            },
            codekit: {
                options: {
                    message: 'Codekit is compiled!'
                }
            },
            less: {
                options: {
                    message: 'LESS is compiled!'
                }
            },
            hint: {
                options: {
                    message: 'JS is hinted!'
                }
            },
            lint: {
                options: {
                    message: 'JS is linted!'
                }
            }
        }
    });


    grunt.registerMultiTask('replaceWithFilename', 'gets file name and find/replaces it', function () {

        var path = require('path')
            , count = 0
            , gtr = require('./node_modules/grunt-text-replace/lib/grunt-text-replace');

//        // this is the synchronous way of doing it
//        this.files.forEach(function(fileGlob) {
//            var destination = fileGlob.dest;
//            grunt.log.debug("FileGlob: " + fileGlob);
//
//            fileGlob.src.forEach(function(filepath) {
//                gtr.replace({
//                    src: filepath,
//                    overwrite: true,
//                    replacements: [{
//                        from: /@@Filename@@/gm,
//                        to: path.basename(filepath)
//                    }]
//                });
//                count++;
//            });
//        });

        var async = require('./node_modules/async/lib/async.js')
            , done = this.async();

        async.each(this.files, function(fileGlob, nextGlob) {
            var destination = fileGlob.dest;

            async.each(fileGlob.src, function(filepath, nextFile) {

                if (grunt.file.exists(filepath)) {
                    if (filepath.match(/\.(html)$/)) {

                        grunt.log.writeln('Putting filename "' + path.basename(filepath) + '" into ' + filepath);

                        gtr.replace({
                            src: filepath,
                            overwrite: true,
                            replacements: [{
                                from: /@@Filename@@/gm,
                                to: path.basename(filepath)
                            }]
                        });

                        count++;

                    } else {
                        nextFile("No handler for filetype: " + filepath);
                        grunt.log.error("No handler for filetype: " + filepath);
                    }
                }

            }, function() {
                // When we are done with all files in this glob
                // continue to the next glob
                nextGlob();
            });
        }, function() {
            // When we are done with all globs
            // call done to tell the Grunt task we are done
            done();
        });
        done();
        grunt.log.ok("Compiled " + count + " files.");
    });


    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.loadNpmTasks('grunt-debug-task');

    // NOTES ON THE ORDER OF TASKS
    //      the replace and replaceWithFilename tasks have to run AFTER the codekit compilation as codekit task
    //      creates html files and the replace functions are looking at the html files
    //
    //
    grunt.registerTask("default",
        ["copy:src",
            "less:dev",
            "jshint:dev","notify:hint",
            "jslint:dev", "notify:lint",
            "codekit:dev", "notify:codekit",
            "replace:blankLines",
            "replaceWithFilename"]);


    var buildTasks = [
        "clean",
        "jshint:dev",
        "jslint:dev",
        "codekit:dev",
        "replace",
        "replaceWithFilename",
        "imagemin",
        "less:prod",
        "requirejs:prod",
        "copy:main"];

    grunt.registerTask("server", buildTasks);

    grunt.registerTask("package", (function(){
        var newList = buildTasks.slice(0);
        newList.push("compress");
        return newList;
    })());

    /*
     To package up the site for client delivery (we have to sent both a QA and a Prod version) I've set up
     a 'package' task that will find/replace hard-coded values, creating a 'qa' directory and a 'prod'
     directory.  These then get zipped up into separate zip files.

     run these two commands to do this:

     grunt package --output=qa --canonical=http://qawww.example.com/employeechoice
     grunt package --output=prod --canonical=http://www.example.com/employeechoice



     */




};

