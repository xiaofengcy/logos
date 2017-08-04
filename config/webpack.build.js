/*eslint-disable func-names, prefer-arrow-callback, object-shorthand, no-console, prefer-template */

const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractText = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const OfflinePlugin = require('offline-plugin');

const paths = require('./paths');
const webpackConfig = require('./webpack.config');

const NPMPackage = require(paths.packageJson);

let GITHASH = '';
const definePlugin = webpackConfig.plugins.find(d => d.constructor.name === 'DefinePlugin');
if (definePlugin) {
  GITHASH = definePlugin.definitions.GITHASH ? definePlugin.definitions.GITHASH.replace(/"/g, '') : '';
}

const config = merge.smart(webpackConfig, {
  entry: {
    'scripts/app': './scripts/index.jsx',
    'scripts/modernizr': './scripts/vendor/modernizr-custom.js',
  },
  output: {
    chunkFilename: 'scripts/[name].js',
    filename: '[name].[git-hash].js',
    path: paths.destination,
    publicPath: '/',
  },
  devtool: 'source-map',
  plugins: [
    new CleanPlugin(['dist'], { root: paths.root }),
    new CopyPlugin([
      { from: '.htaccess' },
    ]),
    new ExtractText('styles/app.[git-hash].css'),
    new HtmlPlugin({
      githash: GITHASH,
      googleAnalytics: {
        trackingId: 'UA-64685370-2',
      },
      inject: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      template: './index.ejs',
      title: 'SVG PORN',
      version: NPMPackage.version,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: {
        keep_fnames: true,
      },
    }),
    new OfflinePlugin({
      autoUpdate: true,
      ServiceWorker: {
        events: true,
      },
      AppCache: {
        events: true,
        caches: ['main', 'additional', 'optional'],
      },
      cacheMaps: [
        {
          match: function() {
            return new URL('/', location); //eslint-disable-line consistent-return
          },
          requestTypes: ['navigate'],
        },
      ],
    }),
  ],
});

module.exports = config;
