'use strict';

import React, {Component} from 'react';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
const position = [42.87, -97.38];
const styles = {height: '600px'};

export default class HeatMap extends Component {

  static propTypes = {points: React.PropTypes.array, search: React.PropTypes.func};
  static defaultProps = {ips: []};

  componentWillMount() {
    this.props.search();
  }

  render() {
    const {points} = this.props;
    console.log("Now showing " + points.length + " points");
    return (
      <div>
        <Map center={position} zoom={4} style={styles} onMoveend={this.handleMove}>
          <HeatmapLayer
            max={10000.0}
            radius={5000000}
            minOpacity={0.05}
            blur={3000}
            gradient={{1.0  : 'red'}}
            points={this.props.points}
            longitudeExtractor={m => m[1]}
            latitudeExtractor={m => m[0]}
            intensityExtractor={m => parseFloat(m[2])}/>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </Map>
      </div>
    );
  }

  handleMove = (evt) => {
    let {actions} = this.props;
    let bounds = evt.target.getBounds();
    let southWest = bounds.getSouthWest();
    let northEast = bounds.getNorthEast();
    let fine = evt.target.getZoom() >= 5;

    let query = {
      "bottomLeftLng": southWest.lng,
      "bottomLeftLat": southWest.lat,
      "topRightLng": northEast.lng,
      "topRightLat": northEast.lat,
      "fine": fine
    };

    this.props.search(query);
  }
}