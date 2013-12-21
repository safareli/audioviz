module.exports = function(grunt) {
    var live = grunt.option('live')? true :false;
    var base = grunt.option('dist')? "dist" :".";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            normal: {
                options: {
                    hostname : "*",
                    livereload: live,
                    base: '.',
                    port: 3000,
                },
            },
            alive: {
                options: {
                    hostname : "*",
                    base: base,
                    port: 3000,
                    keepalive: true
                }
            }
        },
        clean: {
            dist: {
                src: ["dist/"]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                expand: true,
                cwd: '.',
                src: ['*.html'],
                dest: 'dist/',
                ext: '.html'
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: "/*sample reset css*/"
                },
                expand: true,
                cwd: 'css/',
                src: ['*.css'],
                dest: 'dist/css/',
                ext: '.css'
            }
        },
        uglify: {
            scripts: {
               files: [{
                    expand: true,
                    cwd: 'js/',
                    src: ['**/*.js'],
                    dest: 'dist/js/',
                    ext: '.js'
                }] 
            }
        },
        watch: {
            js:{
                files:['js/*.js','js/canvashelper/*.js'],
                tasks : ['jshint:scripts'],
                options: {
                    livereload: live,
                }
            },
            gruntfile:{
                files:['Gruntfile.js'],
                tasks : ['jshint:gruntfile']
            },
            assets: {
                files: [
                    '*.html', 
                    'css/*.css',
                    'img/*.*'],
                options: {
                    livereload: live,
                }
            }
        },
        jshint: {
            gruntfile: ['Gruntfile.js'], 
            scripts:['js/*.js','js/canvashelper/*.js']
        }
    }); 

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [
        'jshint',
        'connect:normal',
        'watch'
    ]);
    grunt.registerTask('server',['connect:alive']);
    grunt.registerTask('min', [
        'clean',
        'htmlmin',
        'uglify',
        'cssmin'
    ]); 
};