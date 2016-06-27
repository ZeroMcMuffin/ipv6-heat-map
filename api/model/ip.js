'use strict';

const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require("mongoose"));
mongoose.Promise = require("bluebird");
const Schema = mongoose.Schema;
const {IP_FINE, IP_COARSE} = require('../constants/constants');

var ipSchema = new Schema({
  count: Number,
  loc: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
  }
});

let IpCoarse = mongoose.model(IP_COARSE, ipSchema);
let IpFine = mongoose.model(IP_FINE, ipSchema);

module.exports = {
  IpCoarse,
  IpFine
};

