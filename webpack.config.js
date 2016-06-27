'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'app/css/app.css'),
    path.join(__dirname, 'app/js/index.jsx')
  ],
  output: {
    path: path.join(__dirname, '/public/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new ExtractTextPlugin("[name].css", {
      allChunks: true
    })
  ],
  module: {
    loaders: [{
      test: /\.(jsx|js)?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015-loose', 'react', 'stage-0']
      }
    },
      { test: /\.proto$/, loader: "proto-loader" },
    { test: /\.json?$/, loader: 'json' },
    { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
    { test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader") },
    { test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000" },
    { test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/, loader: 'file' }]
  },
  resolve: {
    root: path.resolve(__dirname) + '/app/',
    alias: {
      containers: 'js/containers',
      actions: 'js/actions',
      constants: 'js/constants',
      components: 'js/components',
      reducers: 'js/reducers',
      store: 'js/store',
      css: 'css',
      utils: 'js/utils'
    },
    extensions: ['', '.js', '.jsx', 'css']
  }
};
