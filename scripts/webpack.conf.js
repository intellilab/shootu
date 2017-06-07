const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const base = require('./webpack.base.conf');
const { IS_DEV, merge } = require('./utils');

const targets = module.exports = [];

targets.push(merge(base, {
  entry: {
    index: 'src/background',
    shooter: 'src/shooter',
    viewer: 'src/viewer',
  },
  target: 'electron-main',
  node: {
    __dirname: false,
  },
  output: {
    publicPath: '',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'shooter.html',
      chunks: ['shooter'],
      chunksSortMode: 'dependency',
    }),
    new HtmlWebpackPlugin({
      filename: 'viewer.html',
      chunks: ['viewer'],
      chunksSortMode: 'dependency',
    }),
    ... IS_DEV ? [
    ] : [
      // extract css into its own file
      new ExtractTextPlugin('[name].css'),
      new BabiliPlugin({
        builtIns: false,
      }),
    ],
  ],
}));
