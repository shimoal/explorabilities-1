import React from 'react';
import axios from 'axios';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
  }


  componentDidMount() {
    console.log('inisde componenetDidMount');
    this.map = new google.maps.Map(this.refs.map, {
      center: {lat: 37.775, lng: -122.42},
      zoom: 8
    });
  }

  render() {
    return (
      <div id="googleMaps" ref="map"></div>
    )
  }
}