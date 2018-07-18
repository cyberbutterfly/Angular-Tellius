import gulp from 'gulp';
import jade from 'gulp-jade';
import {
  paths,
}
from './paths';

const getHtmlIndex = ({
    isStrict = false,
  }) => gulp.src('./client/index.jade')
  .pipe(jade({
    locals: {
      htmlWebpackPlugin: {
        options: {
          strict: isStrict,
        },
      },
    },
  }))
  .pipe(gulp.dest(paths.dist));

gulp.task('html-index', () => {
  getHtmlIndex({
    isStrict: false,
  });
});

gulp.task('html-index:build', () => {
  getHtmlIndex({
    isStrict: true,
  });
});
