import * as types from 'constants/action-types';
const ProtoBuf = require('protobufjs/dist/protobuf-light');
const protoDefinition = require('../../../api/model/ip.proto');
const builder = ProtoBuf.loadJson(protoDefinition);
let {IpObjectList} = builder.build("Ips");

export function search(criteria) {
  return dispatch => {
    
    fetch("/api/ips" + serialize(criteria))
      .then(function(response) {
        return response.arrayBuffer();
      }).then(function(results) {
      dispatch(searchResults(IpObjectList.decode(results)));
    });
  };
}

function searchResults(results) {
  return {
    type: types.SEARCH,
    ips: results.ips
  };
}

function serialize(obj) {
  if (!obj) return "";
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p) && obj[p]) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  }
  return "?" + str.join("&");
}
