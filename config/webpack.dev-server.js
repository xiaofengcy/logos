/*eslint-disable func-names, prefer-arrow-callback, no-console */
const paths = require('./paths');
const errorOverlayMiddleware = require('react-error-overlay/middleware');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

module.exports = function(proxy, allowedHost) {
  // noinspection WebpackConfigHighlighting
  return {
    clientLogLevel: 'info',
    compress: true,
    contentBase: paths.assets,
    disableHostCheck: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    historyApiFallback: {
      disableDotRule: true,
    },
    host,
    hot: true,
    https: protocol === 'https',
    noInfo: true,
    overlay: false,
    proxy,
    public: allowedHost,
    publicPath: paths.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    stats: { colors: true },
    watchContentBase: true,
    setup(app) {
      app.use(errorOverlayMiddleware());
    },
  };
};
