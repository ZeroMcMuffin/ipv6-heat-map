'use strict';

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);
const port = process.env.PORT || 4000;
const config = require('config');
var mongoose = require('mongoose');
mongoose.connect(config.get('mongo.connection'));
const app = express();

require('./api/routes/routes')(app);
app.use(express.static(__dirname + '/public')); 


const middleware = webpackMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
});
app.use(middleware);
app.use(webpackHotMiddleware(compiler));

app.get('/', function response(req, res) {
    res.sendFile(__dirname+'/app/index.tpl.html');
});

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==>  Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
