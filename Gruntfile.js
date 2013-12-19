module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            livereload: {
                options: {
                    hostname : "*",
                    livereload: true,
                    base: '.',
                    port: 3000,
                },
            },
            noLivereload: {
                options: {
                    hostname : "*",
                    livereload: false,
                    base: '.',
                    port: 3000,
                },
            },
            server: {
                options: {
                    hostname : "*",
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
        watch: {
            html:{
                files:['*.html'],
                tasks : ['htmlmin:dist']
            },
            css:{
                files:['css/*.css'],
                tasks : ['cssmin:dist']
            },
            assets: {
                files: [
                    'dist/*.html', 
                    'dist/css/*.css', 
                    'dist/js/*.js',
                    'dist/img/*.*'],
                options: {
                    livereload: true,
                },
        }
        }
    }); 

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //register defoult task
    grunt.registerTask('default', [
        'min',
        'connect:livereload',
        'watch'
    ]);
    grunt.registerTask('min', [
        'clean',
        'htmlmin',
        'cssmin'
    ]);
};