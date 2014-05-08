/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    noop = g.util.noop,
    queue = require('streamqueue'),
    lazypipe = require('lazypipe'),
    stylish = require('jshint-stylish'),
    bower = require('./bower');

gulp.task('jshint', function () {
  return gulp.src([
    './gulpfile.js',
    './src/**/*.js'
  ])
    .pipe(g.cached('jshint'))
    .pipe(jshint('./.jshintrc'));
});

gulp.task('csslint', function () {
  return cssFiles()
    .pipe(g.cached('csslint'))
    .pipe(g.csslint('./.csslintrc'))
    .pipe(g.csslint.reporter());
});

gulp.task('lint', ['jshint', 'csslint']);
gulp.task('default', ['lint']);


gulp.task('styles-dist', function () {
  return cssFiles().pipe(dist('css', bower.name));
});

gulp.task('scripts-dist', function () {
  return appFiles().pipe(dist('js', bower.name, {ngmin: true}));
});

gulp.task('dist', ['styles-dist', 'scripts-dist']);


gulp.task('test', function () {
  return new queue({objectMode: true})
    .queue(g.bowerFiles().pipe(g.filter('**/*.js')))
    .queue(gulp.src('./bower_components/angular-mocks/angular-mocks.js'))
    .queue(appFiles())
    .queue(gulp.src('./test/**/*.test.js'))
    .done()
    .pipe(g.karma({
      configFile: './test/karma.conf.js',
      action: 'run'
    }));
});


function cssFiles (opt) {
  return gulp.src('./src/**/*.css', opt);
}

function appFiles () {
  var files = ['./src/**/*.js'];
  return gulp.src(files).pipe(g.angularFilesort());
}

function dist (ext, name, opt) {
  opt = opt || {};
  return lazypipe()
    .pipe(g.concat, name + '.' + ext)
    .pipe(gulp.dest, './dist')
    .pipe(opt.ngmin ? g.ngmin : noop)
    .pipe(opt.ngmin ? g.rename : noop, name + '.annotated.' + ext)
    .pipe(opt.ngmin ? gulp.dest : noop, './dist')
    .pipe(ext === 'js' ? g.uglify : g.minifyCss)
    .pipe(g.rename, name + '.min.' + ext)
    .pipe(gulp.dest, './dist')();
}

function jshint (jshintfile) {
  return lazypipe()
    .pipe(g.jshint, jshintfile)
    .pipe(g.jshint.reporter, stylish)();
}
