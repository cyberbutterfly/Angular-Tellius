import gulp from 'gulp';
import jade from 'gulp-jade';
import {
  paths
} from './paths';

gulp.task('index:dev', () => {
  console.log('index:dev');
  return gulp.src(paths.index)
    .pipe(jade())
    .pipe(gulp.dest(paths.tmp));
});


gulp.task('index:build', () => {
  console.log('index:build');
  return gulp.src(paths.index)
    .pipe(jade())
    .pipe(gulp.dest(paths.dist));
});
