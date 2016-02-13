var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    bulkSass     = require('gulp-sass-bulk-import'),
    filelog      = require('gulp-filelog'),
    browserSync  = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify       = require('gulp-uglify'),
    jshint       = require('gulp-jshint'),
    header       = require('gulp-header'),
    rename       = require('gulp-rename'),
    minifyCSS    = require('gulp-minify-css'),
    package      = require('./package.json');


var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

gulp.task('css', function () {
  return gulp.src('src/scss/style.scss')
  .pipe(bulkSass())
  .pipe(sass({errLogToConsole: true}))
  .pipe(autoprefixer('last 2 version'))
  .pipe(gulp.dest('app/assets/css'))
  // .pipe(minifyCSS())
  // .pipe(rename({ suffix: '.min' }))
  // .pipe(header(banner, { package: package }))
  .pipe(gulp.dest('app/assets/css'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function () {
  gulp.src('src/js/scripts.js')
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(header(banner, { package: package }))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify().on('error', function (e) {
      console.log('\x07', e.message); return this.end();
    }))
       .pipe(header(banner, { package: package }))
       .pipe(rename({ suffix: '.min' }))
       .pipe(gulp.dest('app/assets/js'))
       .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "app"
    }
  });
});
gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('default', ['css', 'js', 'browser-sync'], function () {
  gulp.watch(["src/scss/*/*.scss", "src/scss/modules/*"], ['css']);
  gulp.watch("src/js/*.js", ['js']);
  gulp.watch("app/*.html", ['bs-reload']);
});
