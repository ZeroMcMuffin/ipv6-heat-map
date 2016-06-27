'use strict';

const IpService = require('../service/ip');
const ProtoBuf = require("protobufjs");
const builder = ProtoBuf.loadProtoFile("./api/model/ip.proto");
let {IpObjectList} = builder.build("Ips");

module.exports = function(app) {
  app.get('/api/ips', function(req, res) {
    let {bottomLeftLng, bottomLeftLat, topRightLng, topRightLat, fine} = req.query;
    IpService.search([bottomLeftLng, bottomLeftLat], [topRightLng, topRightLat], fine)
      .then((ips)=> {
        // res.send(ips);
        let IpObjects = new IpObjectList(ips.map(item => {
          return {
            latitude: item.loc[1],
            longitude: item.loc[0],
            count: item.count
          }
        }));
        res.send(IpObjects.toBuffer());
      })
      .error(err=> {
        res.status(500);
      });
    // res.send(app.get('ips').toBuffer());
    // res.send({success: true});
  });
};
