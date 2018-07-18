import path from 'path';
import autoprefixer from 'autoprefixer';
import LiveReloadPlugin from 'webpack-livereload-plugin';

const config = {
  entry: {
    app: [
      path.join(__dirname, './client/app/app.js'),
    ],
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
  node: {
    fs: 'empty',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: [/app\/lib/, /node_modules/],
      loader: 'babel',
    }, {
      test: /\.jade$/,
      loader: 'jade',
    }, {
      test: /\.html$/,
      loader: 'raw',
    }, {
      test: /\.styl$/,
      loader: 'style!css!stylus',
    }, {
      test: /\.scss$/,
      loader: 'style!css!postcss-loader!sass',
    }, {
      test: /\.css$/,
      loader: 'style!css',
    }, {
      test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
      loader: 'url-loader?limit=100000',
    }, {
      test: /angular-material-data-table\/.+\.(jsx|js)$/,
      loader: 'imports?angular=angular,this=>window',
    }, {
      test: /d3-cloud\/.+\.(jsx|js)$/,
      loader: 'imports?d3=d3,d2=d3,this=>window',
    }, {
      test: /highcharts-more\/.+\.(jsx|js)$/,
      loader: 'imports?highcharts=highcharts,this=>window',
    }, {
      test: /commonjs-highcharts\/.+\.(jsx|js)$/,
      loader: 'imports?highcharts=highcharts,Chart=highcharts,this=>window',
    }, {
      test: /aws-sdk/,
      loader: 'transform?aws-sdk/dist-tools/transform',
    }, {
      test: /\.json$/,
      loader: 'json',
    }],
  },
  postcss: () => {
    return [
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
    ];
  },
  resolve: {
    moduleDirectories: ['node_modules'],
    extentions: ['', '.js'],
    alias: {
      'angular-click-outside': '@iamadamjowett/angular-click-outside/clickoutside.directive',
    },
  },
  resolveLoader: {
    moduleDirectories: ['node_modules'],
    moduleTemplates: ['*-loader', '*'],
    extentions: ['', '.js'],
  },
  plugins: [
    new LiveReloadPlugin()
  ]
};
module.exports = config;
