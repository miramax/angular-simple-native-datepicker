'use strict';

var gulp = require('gulp'),
    serve = require('gulp-serve');


gulp.task('statics', serve({root: ['./app', '../']}));

