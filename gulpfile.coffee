gulp = require('gulp')
$ = require('gulp-load-plugins')(lazy: true) #plugins
stylish = require('jshint-stylish')
lib = 'lib/*.js'
test = 'test/*.js'
scripts = [lib,test]

gulp.task 'test', ['lint'], ->
  gulp.src(test)
    .pipe $.cached('test')
    .pipe $.mocha({reporter:'spec'})


gulp.task 'lint', ->
  gulp.src(scripts)
    .pipe $.cached('scripts')
    .pipe $.jshint()
    .pipe $.jshint.reporter(stylish)

gulp.task 'default', ['test'],  ->
  #gulp.start 'test'
  return

gulp.task 'watch', ['default'], ->
  gulp.watch scripts, ['test']
  return