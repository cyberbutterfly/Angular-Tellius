import gulp from 'gulp';
import stylint from 'gulp-stylint';
import {
  paths
} from './paths';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';

gulp.task('stylint', () => {
  return gulp.src(paths.styl)
    .pipe(plumber())
    .pipe(stylint())
    .pipe(stylint.reporter())
    .on('error', notify.onError((error) => {
      return error.message;
    }));
});