var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'babel-polyfill',
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client',
    './src/index.jsx',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.json', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: ['babel-loader', 'eslint-loader'],
        include: [path.join(__dirname, 'src'), path.join(__dirname, '../src')],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.md/,
        loaders: ['html-loader', 'markdown-loader'],
      },
    ],
  },
};
