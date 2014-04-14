gulp = require('gulp')
$ = require('gulp-load-plugins')(lazy: true) #plugins
stylish = require('jshint-stylish')
map = require('map-stream')
scripts = ['lib/*.js','test/*.js']
[lib,test] = scripts
notifyEnd = (text) -> 
  now = new Date()
  l = now.getMilliseconds()
  s = now.getSeconds()
  m = now.getMinutes()
  h = now.getHours()
  $.notify({onLast:true, message:"</#{text.toUpperCase()} @ #{h}:#{m}:#{s}.#{l}" })

gulp.task 'test', ['lint'], ->
  gulp.src(test)
    .pipe $.cached('test')
    .pipe $.mocha({reporter:'spec'})
    .pipe notifyEnd('test')


gulp.task 'lint', ->
  gulp.src(scripts)
    .pipe $.cached('scripts')
    .pipe map((file, cb) ->
      path = file.path.substring(__dirname.length)
      matches = path.match(/lib\/(.+\.(js|coffee))/)
      if matches and $.cached.caches['test']
          delete $.cached.caches['test']["#{__dirname}/test/#{matches[1]}"]
      cb(null,file)
    )
    .pipe $.jshint()
    .pipe $.jshint.reporter(stylish)
    .pipe notifyEnd('lint')

gulp.task 'default', ['test'],  ->
  #gulp.start 'test'
  return

gulp.task 'watch', ['default'], ->
  gulp.watch scripts, ['test']
  return