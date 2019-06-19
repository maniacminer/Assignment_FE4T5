const gulp = require('gulp');
const browserSync = require('browser-sync').create();

function serve(done) {
  browserSync.init({
    server: {
        baseDir: "./src/"
    }
  });

  gulp.watch('./src/**/*', cb => {
    console.log('changed');
    browserSync.reload();
    cb();
  });

  done();
}

exports.serve = serve;
exports.default = serve;
