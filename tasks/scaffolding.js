import gulp from 'gulp';
import yargs    from 'yargs';
import path from 'path';
import template from 'gulp-template';
import rename   from 'gulp-rename';
import {
  paths,
  resolveToComponents,
  resolveToViewModels
} from './paths';

gulp.task('generate', () => {

  let cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  let name = yargs.argv.name;
  let type = yargs.argv.type;
  let parentPath = yargs.argv.parent || '';

  let templatePath = {};
  let destPath = {};
  switch (type) {
  case 'cmp':
    templatePath = paths.blankComponent;
    destPath = path.join(resolveToComponents(), parentPath, name);
    break;
  case 'vm':
    destPath = path.join(resolveToViewModels(), parentPath, name);
    templatePath = paths.blankViewModel;
    break;
  default :
    destPath = path.join(resolveToComponents(), parentPath, name);
    templatePath = paths.blankComponent;
  }

  return gulp.src(templatePath)
    .pipe(template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});