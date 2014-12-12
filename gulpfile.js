var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');

var paths = {
  content_scripts: [
    'chrome/content/inject.js',
  ]
};

gulp.task('browserify', function() {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src(['./chrome/content.js'])
    .pipe(browserified)
    //.pipe(uglify())
    .pipe(gulp.dest('./chrome/dist'));
});
