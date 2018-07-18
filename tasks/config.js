import gulp from 'gulp';
import ngConstant from 'gulp-ng-constant';
import {
  paths,
  resolveToApp,
} from './paths';

gulp.task('config', () => {
  gulp.src(paths.config)
    .pipe(ngConstant())
    .pipe(gulp.dest(resolveToApp()));
});