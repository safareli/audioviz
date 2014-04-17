gulp = require('gulp')
$ = require('gulp-load-plugins')(lazy: true) #plugins
stylish = require('jshint-stylish')
map = require('map-stream')
source = require('vinyl-source-stream')
browserify = require('browserify')
cacheify = require('cacheify')
partialify = require('partialify')
level = require('level')
db = level('./.cache/')
cachingPartialify = cacheify(partialify, db)

isDebag = false


scripts = ['lib/*.js','test/*.js']
[lib,test] = scripts

logDateLine = () ->
  now = new Date()
  l = now.getMilliseconds()
  s = now.getSeconds()
  m = now.getMinutes()
  h = now.getHours()
  console.log("===============[#{h}:#{m}:#{s}.#{l}]===============")
  
gulp.task "connect", ->
  $.connect.server
    host: '0.0.0.0'
    root: '.'
    port: 3000
    livereload:
      port: 4000
  
gulp.task 'test', ['lint'], ->
  gulp.src(test)
    .pipe $.cached('test')
    .pipe $.mocha({reporter:'spec'})

gulp.task 'build', ['test'], ->
  browserify 
    entries: ["./lib"]
    #extensions: [".coffee", ".hbs", ".css"]
  .transform cachingPartialify
  .bundle(debug: isDebag)
  .on "error", $.notify.onError
    message: "<%= error.message %>"
    title: "JavaScript Error"
  .pipe source('bundle.js')
  .pipe $.if(!isDebag, $.streamify($.uglify()))
  .pipe gulp.dest('./')
  .pipe $.if(isDebag, $.connect.reload())

gulp.task 'lint', ->
  gulp.src(scripts)
    .pipe $.cached('scripts')
    .pipe map (file, cb) ->
      path = file.path.substring(__dirname.length)
      matches = path.match(/lib\/(.+\.(js|coffee))/)
      if matches and $.cached.caches['test']
        delete $.cached.caches['test']["#{__dirname}/test/#{matches[1]}"]
      cb(null,file)
    .pipe $.jshint()
    .pipe $.jshint.reporter(stylish)

gulp.task 'default', ['test'],  ->
  return

gulp.task 'watch', ['connect'], ->
  isDebag = true;
  logDateLine();
  gulp.start 'build'
  gulp.watch scripts, () -> 
    logDateLine();
    gulp.start 'build'
  return