import gulp from 'gulp';
import browserSync from 'browser-sync';

gulp.task('serve', () => {
  browserSync({
    open: false,
    host: 'localhost',
    port: 8000,
    proxy: 'http://localhost:3000',
  });
});
