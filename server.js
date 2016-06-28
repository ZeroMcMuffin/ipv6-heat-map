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

// Watcher running in child process that recursively calls itself on completion
// todo: Currently only works in dev.  Crashes during upload on Ubuntu 16.04
spawnWatcher();

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

app.listen(port, 'localhost', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});


/***
 * EXPERIMENTAL!  Only works consistently in dev.
 */
function spawnWatcher() {
  const spawn = require('child_process').spawn;
  const watch = spawn('node', ['scripts/watch.js']);

  watch.stdout.on('data', function(data) {
    console.log("stdout: " + data);
  });

  watch.stderr.on('data', function(data) {
    console.log("stderr: " + data);
  });

  watch.on('close', function(code) {
    console.log("child process exited with code " + code);
    spawnWatcher();
  });
}