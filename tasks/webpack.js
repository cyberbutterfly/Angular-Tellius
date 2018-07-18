import gulp from 'gulp';
import gulpWebpack from 'gulp-webpack';
import {
  paths,
}
from './paths';
import webpack from 'webpack';
import NgAnnotatePlugin from 'ng-annotate-webpack-plugin';
import PathChunkPlugin from 'path-chunk-webpack-plugin';

const config = require('../webpack.config.babel');

gulp.task('webpack', () => {
  config.cache = true;
  config.debug = true;
  config.devtool = 'eval';

  config.plugins = [
    new PathChunkPlugin({
      name: 'vendor',
      test: 'node_modules/',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ];

  return gulp.src(paths.entry)
    .pipe(gulpWebpack(config))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('webpack:build', () => {
  config.plugins = [
    new PathChunkPlugin({
      name: 'vendor',
      test: 'node_modules/',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin(),
    new NgAnnotatePlugin({
      add: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
      },
      comments: false,
    }),
  ];

  return gulp.src(paths.entry)
    .pipe(gulpWebpack(config))
    .pipe(gulp.dest(paths.dist));
});
