import gulp from 'gulp';
import del from 'del';
import path from 'path';
import {
  paths,
  resolveToApp
} from './paths';

gulp.task('clean', () => {
  let folders = [].concat(paths.tmp, paths.dist, resolveToApp('constants.js'));

  return del(folders);
});