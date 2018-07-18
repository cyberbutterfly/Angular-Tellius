import gulp from 'gulp';
import changedInPlace from 'gulp-changed-in-place';
import eslint from 'gulp-eslint';
import ignore from 'gulp-ignore';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import {
  paths,
} from './paths';

gulp.task('eslint', () => {
  return gulp.src(paths.js)
    .pipe(plumber())
    .pipe(ignore('**/*.spec.js'))
    .pipe(changedInPlace({
      firstPass: true,
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('error', notify.onError((error) => {
      return error.message;
    }));
});
