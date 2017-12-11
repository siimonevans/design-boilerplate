const path = require('path');
const webpack = require('webpack');

/**
 * Define webpack plugins
 * @param  {string} env
 * @return {object}
 */
function getPlugins(isDev) {
  // define free variables
  const GLOBALS = {
    __DEV__: !!isDev,
  };

  const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
  ];

  if (!isDev) {
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.UglifyJsPlugin());
  }

  return plugins;
}


/**
 * Define webpack loaders
 * @param  {string} env
 * @return {object}
 */
function getLoaders() {
  const loaders = [
    {
      test: /\.html$/,
      loader: 'handlebars-loader',
    },
    {
      test: /\.js$/,
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'tests'),
      ],
      exclude: /(node_modules)/,
      loader: 'babel',
    },
  ];

  return loaders;
}


/**
 * Configurable Webpack config
 * @param  {object} config Configuration from gulpfile
 * @return {object}
 */
module.exports = function webpackConfig(config) {
  return {
    entry: config.scripts.src,
    output: {
      path: path.resolve(__dirname, config.scripts.dest),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.html'],
    },
    devtool: config.dev ? '#inline-source-map' : '',
    module: {
      loaders: getLoaders(config.dev),
    },
    plugins: getPlugins(config.dev),
    cache: {},
  };
};
