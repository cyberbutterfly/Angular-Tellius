import gulp from 'gulp';
import {
  paths,
} from './paths';


gulp.task('copy', () => {
  let files = [].concat(
    paths.assets,
    paths.fonts
  );

  return gulp.src(files, {
    base: paths.root,
  })
    .pipe(gulp.dest(paths.dist));
});
