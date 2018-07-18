import gulp     from 'gulp';
import runSequence from 'run-sequence';
import requireDir from 'require-dir';

requireDir('./tasks');

gulp.task('default', (done) => {
  runSequence('clean',
    'config',
    'webpack',
    'copy',
    'html-index',
    'serve',
    'watch',
    done);
});
