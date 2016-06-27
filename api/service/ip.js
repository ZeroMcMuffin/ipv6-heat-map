'use strict';

const {IpCoarse, IpFine} = require("./../model/ip");

function search(bottomLeft, topRight, fine = false){
  let model = (fine) ? IpFine : IpCoarse;

  let criteria = (bottomLeft[0] && topRight[0])
    ? {
        "loc": {
          "$geoWithin": {
            "$box": [
              bottomLeft,
              topRight
            ]
          }
        }
      }
    : {};

  return model.find(criteria, { '_id': 0}).lean().exec();
}

function bulkInsert(ips, fine = true) {
  console.log("Inserting " + ips.length + " %s ips.", (fine) ? 'fine': 'coarse');
  let model = (fine) ? IpFine : IpCoarse;
  return model.collection.remove({})
    .then(model.collection.insert(ips));
}

module.exports = {
  search,
  bulkInsert
};


