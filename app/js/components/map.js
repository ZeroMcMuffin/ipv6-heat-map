'use strict';

import React, {Component} from 'react';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';

const INITIAL_POSITION = [42.87, -97.38];
const ZOOM_THRESHOLD = 10;
const INITIAL_ZOOM = 3;

const HEATMAP_OPTIONS = {maxZoom: ZOOM_THRESHOLD};


// Make map fit viewport.  Prevents overflow and ensures smaller lat/long boundary for efficient requests.
const styles = {height: '90vh'};

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
    const {zoom} = this.state;
    console.log("Now showing " + points.length + " points");
    let markers = (zoom >= ZOOM_THRESHOLD) ? renderMarkers(points) : null;
    let heatmap = (zoom < ZOOM_THRESHOLD)  ? renderHeatMap(points, HEATMAP_OPTIONS) : renderHeatMap([], HEATMAP_OPTIONS);

    return (
      <div style={styles}>
        <a href="https://github.com/ZeroMcMuffin/ipv6-heat-map" target="_blank">Repo</a>
        <Map center={INITIAL_POSITION} zoom={INITIAL_ZOOM} style={styles} onMoveend={this.handleMove}>
          {markers}
          {heatmap}
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
        </Map>
        This product includes GeoLite2 data created by MaxMind, available from
        <a href="http://www.maxmind.com" target="_blank"> http://www.maxmind.com</a>.
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

const renderHeatMap = (points, options = {maxZoom: ZOOM_THRESHOLD}) => {
  let {maxZoom} = options;

  return (
    <HeatmapLayer
      maxZoom={maxZoom}
      points={points}
      longitudeExtractor={m => m[1]}
      latitudeExtractor={m => m[0]}
      intensityExtractor={m => parseFloat(m[2])}/>
  );
}