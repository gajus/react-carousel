/* eslint-disable no-process-env, id-match, no-var, object-shorthand, import/no-commonjs, filenames/match-regex */

const path = require('path');
const webpack = require('webpack');

const devServer = {
  contentBase: path.join(__dirname, '/src/endpoint'),
  historyApiFallback: true,
  host: '127.0.0.1',
  hot: false,
  noInfo: false,
  port: 8000,
  publicPath: '/static/',
  quiet: false
};

module.exports = {
  context: __dirname,
  devServer,
  devtool: 'source-map',
  entry: {
    app: [
      './src'
    ]
  },
  module: {
    loaders: [
      {
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
        test: /\.js$/
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/dist'),
    publicPath: devServer.publicPath
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
