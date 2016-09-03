'use strict';
var gulp = require('gulp');
var polybuild = require('polybuild');

gulp.task('polybuild', function() {
  return gulp.src(global.config.src + '/elements.html')
		.pipe(polybuild())
		.pipe(gulp.dest(global.config.dest));
});
