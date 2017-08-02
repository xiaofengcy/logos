const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  app: resolvePath('app'),
  appHtml: resolvePath('assets/index.html'),
  appIndexJs: resolvePath('app/scripts/index.jsx'),
  appScripts: resolvePath('app/scripts'),
  assets: resolvePath('assets'),
  destination: resolvePath('dist'),
  modernizr: resolvePath('config/modernizrrc.json'),
  publicPath: resolvePath('/'),
  packageJson: resolvePath('package.json'),
  root: resolvePath(''),
  store: resolvePath('app/scripts/store/index'),
  test: resolvePath('test'),
};
