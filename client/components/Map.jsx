import React from 'react';
import axios from 'axios';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initMap();
  }

  initMap() {
    map = new google.maps.Map(this.refs.map, this.props.mapSettings);
  }

  render() {
    return (
      <div id="googleMaps" ref="map"></div>
    )
  }
}