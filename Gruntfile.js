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
        watch: {
            assets: {
                files: ['*.html', 'css/*.css', 'js/*.js','img/*.*'],
                options: {
                    livereload: true,
                },
            }
        }
    }); 

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    //register defoult task
    grunt.registerTask('default', [
        'connect:livereload',
        'watch:assets'
    ]);
};