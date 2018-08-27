var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');
var webpack = require('gulp-webpack');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var execFile = require('child_process').execFile;

gulp.task('default', ['closure', 'webpack', 'browserify']);

gulp.task('proto', function() {
  return execFile(
      'sh',
      [
        '-c', 'protoc --js_out=import_style=commonjs:src -I proto proto/*.proto'
      ],
      (err, stdout, stderr) => {
        console.log(err, stdout, stderr);
      });
});

gulp.task('closure', ['proto'], function() {
  return gulp
      .src([
        'src/*.js',
        'node_modules/google-protobuf/**.js',
        'node_modules/google-protobuf/package.json',
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

gulp.task('webpack', ['proto'], function() {
  return gulp.src('src/index.js')
      .pipe(webpack({output: {filename: 'webpack.js'}}))
      .pipe(gulp.dest('dist'));
});

gulp.task('browserify', ['proto'], function() {
  return gulp.src('src/index.js')
      .pipe(browserify())
      .pipe(rename('browserify.js'))
      .pipe(gulp.dest('dist'));
});
