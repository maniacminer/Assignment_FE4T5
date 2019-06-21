const  gulp = require('gulp');
const  { watch, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

sass.compiler = require('node-sass');


function sassCompile(cb) {
  gulp.src('./src/sass/style.sass')
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    // .pipe(cleanCSS({compatibility: 'ie11'}))
    .pipe(gulp.dest('./build/css'));

  if (typeof cb === 'function')
  {
    cb();
  }
}

function htmlCompile(cb) {
  gulp.src('./src/*.html')
    .pipe(gulp.dest('./build'));

  if (typeof cb === 'function')
  {
    cb();
  }
}

function jsCompile(cb) {
  gulp.src([
    // Важна последовательность сборки js!
    'node_modules/imask/dist/imask.js',
    // 'node_modules/babel-polyfill/dist/polyfill.js',  // в требованиях есть e11
    './src/common.blocks/**/*.js',
    './src/js/**/*.js'
    ])
    .pipe(concat('app.js'))
    // .pipe(babel({
    //   presets: ['@babel/env']
    // }))
    // .pipe(uglify())
    .pipe(gulp.dest('./build/js/'))
  }

function imgCompile(cb) {
  gulp.src('./src/img/*')
    .pipe(gulp.dest('./build/img'));

  if (typeof cb === 'function')
  {
    cb();
  }

}



const build = parallel(sassCompile, htmlCompile, imgCompile, jsCompile);


function serve(done) {
  browserSync.init({
    server: {
        baseDir: "./build/"
    }
  });

  // при любом изменении билда - рестарт
  watch(['./build/**/*'], cb => {
    console.log('restarting ...');
    browserSync.reload();
    cb();
  });

  build();

  watch(['./src/**/*.sass'], cb => {
    console.log('rebuilding sass...');
    sassCompile();
    cb();
  });

  watch(['./src/img/*'], cb => {
    console.log('rebuilding img...');
    imgCompile();
    cb();
  });  

  watch(['./src/**/*.html'], cb => {
    console.log('rebuilding html...');
    htmlCompile();
    cb();
  });    

  watch(['./src/**/*.js'], cb => {
    console.log('rebuilding js...');
    jsCompile();
    cb();
  });      


  done();
}



exports.build = build;

exports.serve = serve;
exports.default = serve;
exports.sass = sassCompile;