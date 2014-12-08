var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');

var paths = {
  content_scripts: [
    'chrome/content/inject.js', 
  ]
};

gulp.task('concat', function() {
  gulp.src(paths.content_scripts)
    .pipe(concat('content.js'))
    .pipe(gulp.dest('chrome/build'));
});
