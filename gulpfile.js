const  gulp = require('gulp');
const  { watch, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');

sass.compiler = require('node-sass');


function sassCompile(cb) {
  gulp.src('./src/sass/style.sass')
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
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

function imgCompile(cb) {
  gulp.src('./src/img/*')
    .pipe(gulp.dest('./build/img'));

  if (typeof cb === 'function')
  {
    cb();
  }

}


const staticCompile = parallel(htmlCompile, imgCompile)
const build = parallel(sassCompile, staticCompile);


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


  done();
}



exports.build = build;

exports.serve = serve;
exports.default = serve;
exports.sass = sassCompile;



 
 
 