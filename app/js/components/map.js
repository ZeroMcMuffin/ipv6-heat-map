'use strict';

import React, {Component} from 'react';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';

const position = [42.87, -97.38];
const styles = {height: '90vh'};
const ZOOM_THRESHOLD = 8;
const INITIAL_ZOOM = 4;

export default class HeatMap extends Component {

  static propTypes = {points: React.PropTypes.array, search: React.PropTypes.func};
  static defaultProps = {ips: [], zoom: 4};

  constructor(props) {
    super(props);
    this.state = {zoom: props.zoom};
  }

  componentWillMount() {
    this.props.search();
  }

  render() {
    const {points} = this.props;
    console.log("Now showing " + points.length + " points");
    let markers = (this.state.zoom >= ZOOM_THRESHOLD) ? renderMarkers(points) : null;
    let heatmap = (this.state.zoom < ZOOM_THRESHOLD)  ? renderHeatMap(points) : renderHeatMap([]);

    return (
      <div style={styles}>
        <Map center={position} zoom={INITIAL_ZOOM} style={styles} onMoveend={this.handleMove}>
          {markers}
          {heatmap}
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
        </Map>
        This product includes GeoLite2 data created by MaxMind, available from
        <a href="http://www.maxmind.com">http://www.maxmind.com</a>.
      </div>
    );
  }

  handleMove = (evt) => {
    let {actions} = this.props;
    let bounds = evt.target.getBounds();
    let southWest = bounds.getSouthWest();
    let northEast = bounds.getNorthEast();
    this.setState({
      zoom: evt.target.getZoom()
    });
    let fine = evt.target.getZoom() >= 7;

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

const renderMarkers = (points) => {
  return points.map((point, index) => {
    let label = (point[2] > 2)
      ? <span>Point contains {point[2]} IP addresses.</span>
      : <span>Point contains the following ips addresses: {point[3].join(',')}.</span>;
    return (
      <Marker position={[point[0], point[1]]} key={index}>
        <Popup>
          {label}
        </Popup>
      </Marker>
    );
  });
};

const renderHeatMap = (points, options = {max: 0.1, radius: 0.1, minOpacity: 0.3, blur: 0, maxZoom: 9}) => {
  let {max, radius, minOpacity, blur, maxZoom} = options;

  return (
    <HeatmapLayer
      max={max}
      radius={radius}
      minOpacity={minOpacity}
      blur={blur}
      maxZoom={maxZoom}
      gradient={{1.0  : 'red'}}
      points={points}
      longitudeExtractor={m => m[1]}
      latitudeExtractor={m => m[0]}
      intensityExtractor={m => parseFloat(m[2])}/>
  );
}