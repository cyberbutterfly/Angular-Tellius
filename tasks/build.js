import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('build', (done) => {
  runSequence(
    'clean',
    'config',
    'webpack:build',
    'copy',
    'html-index:build',
    done);
});
