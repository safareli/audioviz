gulp = require('gulp')
$ = require('gulp-load-plugins')(lazy: true) #plugins
stylish = require('jshint-stylish')
map = require('map-stream')
source = require('vinyl-source-stream')
browserify = require('browserify')

cacheify = require('cacheify')
brfs = require('brfs')
level = require('level')
db = level('./cache')
cachingBrfs = cacheify(brfs, db)

isDebag = false


scripts = ['lib/*.js','test/*.js']
[lib,test] = scripts

gulp.task 'line',  ->
  now = new Date()
  l = now.getMilliseconds()
  s = now.getSeconds()
  m = now.getMinutes()
  h = now.getHours()
  console.log("===============[#{h}:#{m}:#{s}.#{l}]===============")

gulp.task 'test', ['lint'], ->
  gulp.src(test)
    .pipe $.cached('test')
    .pipe $.mocha({reporter:'spec'})

gulp.task 'build', ['line', 'test'], ->
  browserify 
    entries: ["./lib"]
    #extensions: [".coffee", ".hbs", ".css"]
  .transform(cachingBrfs)
  .bundle(debug: isDebag)
  .on "error", $.notify.onError
    message: "<%= error.message %>"
    title: "JavaScript Error"
  .pipe source('bundle.js')
  .pipe gulp.dest('./')

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

gulp.task 'watch', ->
  isDebag = true;
  gulp.start 'build'
  gulp.watch scripts, ['build']
  return