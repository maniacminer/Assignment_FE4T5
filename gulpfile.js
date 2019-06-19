const  gulp = require('gulp');
const  { watch, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

sass.compiler = require('node-sass');


function sassCompile(cb) {
  gulp.src('./src/sass/style.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));

  cb();
}

function staticCompile(cb) {
  gulp.src('./src/*.html')
    .pipe(gulp.dest('./build'));

  gulp.src('./src/img/*')
    .pipe(gulp.dest('./build/img'));


  cb();
}


const build = parallel(sassCompile, staticCompile);


function serve(done) {
  browserSync.init({
    server: {
        baseDir: "./build/"
    }
  });

  watch(['./build/**/*'], cb => {
    console.log('restarting ...');
    browserSync.reload();
    cb();
  });

  watch(['./src/**/*'], cb => {
    console.log('rebuilding ...');
    build();
    cb();
  });



  done();
}



exports.build = build;

exports.serve = serve;
exports.default = serve;
exports.sass = sassCompile;



 
 
 