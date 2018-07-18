import gulp from 'gulp';
import runSequence from 'run-sequence';
import serve from 'browser-sync';
import {
  paths,
} from './paths';

let reload = () => serve.reload();

gulp.task('watch', () => {
  gulp.watch(paths.template, [
    'webpack',
    reload,
  ]);

  gulp.watch(paths.js, () => {
    return runSequence(
      // 'eslint',
      'webpack',
      reload);
  });

  gulp.watch(paths.styl, [
    'webpack',
    reload,
  ]);

  gulp.watch(paths.scss, [
  'webpack',
  reload,
  ]);
});
