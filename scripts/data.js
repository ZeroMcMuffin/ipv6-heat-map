'use strict';

const fs = require('fs');
const parse = require('csv').parse;
const config = require('config');
const Promise = require('bluebird');
const jsonfile = Promise.promisifyAll(require('jsonfile'));
const mongoose = require('mongoose');
mongoose.connect(config.get('mongo.connection'));
const ipService = require('./../api/service/ip');

/**
 * Let's cleanup the GeoLit2 CSV and then store it.  
 * 
 * It works like this:
 * 1. Load the CSV 
 * 2. Parse the CSV, removing dupes for IPs but accumulate a total for that IP's dupes.
 * 3. Cram that into Mongodb and leverage 2d Geospatial Indexing
 * 4. ???
 * 5. Profit
 */

function loadCSV() {
  console.log("Starting to import data");
  fs.createReadStream(config.get('csv.blocks')).pipe(parseCSV());
};

/**
 * 1) Create a map of the data collapsing dupes but accumulating count for both coarse and fine data
 * 2) Collapse composite key out of data structure for both coarse and fine data
 * @returns a read stream for CSV
 */
function parseCSV() {
  return parse( {delimiter: ',', columns: true}, function( err, data ) {
    // Create groupings IPs from dupe lat/longs and accumulate a count
    let {coordsFine, coordsCoarse} = createMap(data);
    // Remove explode object up a level and remove lat/long key
    coordsFine = collapseObject(coordsFine);
    coordsCoarse = collapseObject(coordsCoarse);
    Promise.each([
      storeIps(coordsFine, true),
      storeIps(coordsCoarse, false)
    ]).then(() => {
       console.log('Finished with no errors.');
    }).error((err) => {
      console.log('Exiting with errors.', err);
    }).finally(()=> {
      mongoose.connection.close();
      process.exit(0);
    });
  });
}


/**
 * Maps CSV into coarse and fine arrays of {latitude: float, longitude: float, count: int}
 * @returns {coordsFine: [], coordsCoarse: []}
 */
function createMap(coordinates) {
  let coordsFine = {};
  let coordsCoarse = {};

  coordinates.forEach( item => {
    let keyFine = item.latitude+""+item.longitude;
    if( coordsFine.hasOwnProperty(keyFine)) {
      coordsFine[keyFine].count = coordsFine[keyFine].count + 1;
    } else {
      coordsFine[keyFine] = {
        latitude:  parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        count: 1
      };
    }

    let latCoarse = parseFloat(item.latitude).toFixed(1);
    let lngCoarse = parseFloat(item.longitude).toFixed(1);
    let keyCoarse = latCoarse+""+lngCoarse;

    if( coordsCoarse.hasOwnProperty(keyCoarse)) {
      coordsCoarse[keyCoarse].count = coordsCoarse[keyCoarse].count + 1;
    } else {
      coordsCoarse[keyCoarse] = {
        latitude: parseFloat(latCoarse),
        longitude: parseFloat(lngCoarse),
        count: 1
      };
    }
  });

  return {coordsFine, coordsCoarse};
}

/**
 * Strips parent object property (composite key of lat+lng)
 * Also massaging geo data into array of [long,lat] for mongo 2d geospatial index convenience
 */
function collapseObject(coordinates) {
  // Remove explode object up a level and remove lat/long key
  return Object.keys(coordinates).map(item => {
    return {
      loc:  [coordinates[item].longitude, coordinates[item].latitude],
      count:  coordinates[item].count
    };
  });
}


function storeIps(ips, fine = true) {
  return ipService.bulkInsert(ips, fine);
}

// const initialize = function(){
//   loadCSV();
// };

module.exports = loadCSV;

