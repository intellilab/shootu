const gulp = require('gulp');
const del = require('del');

const DIST = 'dist';
const paths = {
  copy: [
    'src/assets/**',
  ],
};

function clean() {
  return del(DIST);
}

function copy() {
  return gulp.src(paths.copy, { base: 'src' })
    .pipe(gulp.dest(DIST));
}

async function jsDev() {
  require('@gera2ld/plaid-webpack/bin/develop')();
}

async function jsProd() {
  return require('@gera2ld/plaid-webpack/bin/build')({
    api: true,
    keep: true,
  });
}

exports.clean = clean;
exports.copy = copy;
exports.dev = gulp.series(copy, jsDev);
exports.build = gulp.series(clean, copy, jsProd);
