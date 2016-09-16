'use strict';
const gulp = require('gulp');
const mocha = require('gulp-spawn-mocha');
var mochaOptions = {
  showStack: true,
  istanbul: true,
  timeout: 30000,
  env: {
    'NODE_ENV': 'test'
  }
};

gulp.task('test', function (cb) {
	gulp.src(['test/specs/**/*.js'], {
		read: false
	})
  .pipe(mocha(mochaOptions))
  .once('error', function(){
    process.exit(1);
  })
  .once('end', function()  {
    cb();
    process.exit();
  });
});
