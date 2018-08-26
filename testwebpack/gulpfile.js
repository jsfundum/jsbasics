var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');
var webpack = require('gulp-webpack');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

gulp.task('default', ['closure', 'webpack', 'browserify']);

gulp.task('closure', function() {
  return gulp
      .src([
        'src/*.js',
        'node_modules/testutil/**.js',
        'node_modules/testutil/package.json',
      ])
      .pipe(closureCompiler({
        compilerPath: 'node_modules/google-closure-compiler/compiler.jar',
        fileName: 'closure.js',
        compilerFlags: {
          compilation_level: 'ADVANCED',
          generate_exports: true,
          process_common_js_modules: true,
          module_resolution: 'NODE',
          dependency_mode: 'STRICT',
          entry_point: 'src/index.js',
        }
      }))
      .pipe(gulp.dest('dist'));
});

gulp.task('webpack', function() {
  return gulp.src('src/index.js')
      .pipe(webpack({output: {filename: 'webpack.js'}}))
      .pipe(gulp.dest('dist'));
});

gulp.task('browserify', function() {
  return gulp.src('src/index.js')
      .pipe(browserify())
      .pipe(rename('browserify.js'))
      .pipe(gulp.dest('dist'));
});
