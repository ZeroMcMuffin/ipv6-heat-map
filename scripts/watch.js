'use strict';

let fs = require('fs');
let config = require('config');
let initialize = require('./data.js');

function watch(file) {
  fs.watchFile(file, (curr, prev) => {
    console.log("Updating because of change to %s.", file);
    initialize(); // no protection for abuse currently, todo: allow only one active initialization at a time
  });
}

watch(config.get('csv.blocks'));