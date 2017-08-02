const webpack = require('webpack');
const ExtractText = require('extract-text-webpack-plugin');
const GitInfoPlugin = require('git-info-webpack-plugin');
const autoprefixer = require('autoprefixer');
const moment = require('moment');
const paths = require('./paths');

const NPMPackage = require(paths.packageJson);
const gitInfoPlugin = new GitInfoPlugin({
  hashCommand: 'rev-parse --short HEAD',
});

const isProd = process.env.NODE_ENV === 'production';
const cssLoaders = [
  'style',
  'css?sourceMap',
  {
    loader: 'postcss',
    options: {
      sourceMap: true,
      plugins: [
        autoprefixer({
          browsers: NPMPackage.browserslist,
        }),
      ],
    },
  },
  'sass?sourceMap',
];

const config = {
  resolve: {
    alias: {
      'app-store$': paths.store,
      assets: paths.assets,
      modernizr$: paths.modernizr,
      test: paths.test,
    },
    modules: [paths.appScripts, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  context: paths.app,
  entry: {},
  output: {
    filename: '[name].[git-version].js',
    path: paths.destination,
    chunkFilename: '[name].js',
    publicPath: '/',
  },
  devtool: '#inline-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    gitInfoPlugin,
    new webpack.DefinePlugin({
      'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV),
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      BRANCH: JSON.stringify(gitInfoPlugin.branch()),
      BUILD_DATE: JSON.stringify(moment().format('DD/MM/YYYY')),
      GITHASH: JSON.stringify(gitInfoPlugin.hash()),
      VERSION: JSON.stringify(NPMPackage.version),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel?cacheDirectory'],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loader: isProd ? ExtractText.extract({
          use: cssLoaders.slice(1),
        }) : cssLoaders,
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url',
            query: {
              limit: 10000,
              name: 'fonts/[name].[ext]',
              minetype: 'application/font-woff',
            },
          },
        ],
        include: /fonts/,
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file',
            query: { name: 'fonts/[name].[ext]' },
          },
        ],
        include: /fonts/,
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        use: [
          {
            loader: 'file',
            query: { name: 'images/[name].[ext]' },
          },
          {
            loader: 'image-webpack',
            query: {
              optipng: {
                optimizationLevel: 5,
              },
              pngquant: {
                quality: '75-90',
              },
            },
          },
        ],
        include: /media|react-widgets/,
      },
      {
        test: /(manifest\.json|\.xml)$/,
        use: [
          {
            loader: 'file',
            query: { name: '[name].[ext]' },
          },
        ],
        include: /assets/,
      },
      {
        test: /modernizrrc\.json$/,
        use: ['expose?Modernizr', 'modernizr', 'json'],
      },
      {
        test: /\.md$/,
        use: ['html', 'markdown'],
      },
    ],
  },
};

module.exports = config;
