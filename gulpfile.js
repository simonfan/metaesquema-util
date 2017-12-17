// third-party dependencies
const gulp = require('gulp')
const size = require('gulp-size')
const tap = require('gulp-tap')

// browserify
const browserify = require('browserify')
const source     = require('vinyl-source-stream')
const buffer     = require('vinyl-buffer')

// browser-sync
var browserSync = require('browser-sync').create()

gulp.task('javascript', function () {

  return gulp.src('demo/*.js', {read: false}) // no need of reading file because browserify does.

    // transform file objects using gulp-tap plugin
    .pipe(tap(function (file) {
      // replace file contents with browserify's bundle stream
      file.contents = browserify(file.path, {debug: true}).bundle()
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('distribute', ['javascript'], function () {
  gulp.src([
    'demo/index.html',
    'demo/resources/**/*'
  ], { base: 'demo' })
  .pipe(gulp.dest('dist'))
})

gulp.task('develop', ['javascript'], function () {

  gulp.watch([
    'lib/**/*.js',
    'demo/**/*.js'
  ], ['javascript'])

  gulp.watch([
    'dist/**/*.js',
    'demo/index.html',
    'demo/**/*.css',
  ], browserSync.reload)

  browserSync.init({
    server: ['dist', 'demo'],
  })
})
