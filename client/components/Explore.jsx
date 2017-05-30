import React from 'react';
import axios from 'axios';
import Map from './Map.jsx';
import Place from './Place.jsx';
import ItineraryList from './itineraryList.jsx';

export default class Explore extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      place: {},
      query: '',
      itinerary: {},
      saveMessage: '',
      mapSettings: {
        center: {lat: 37.775, lng: -122.42},
        zoom: 8,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      }
    };
  }
  render() {
    return (
      <div id="exploreContainer">
        <Map mapSettings={this.state.mapSettings}/> 
        <div id="exploreContent" className="clearfix">
          <Place place={this.state.place} addItem={this.addItem.bind(this)}/>
          <ItineraryList
            list={this.state.itinerary}
            query={this.state.query}
            saveMessage={this.state.saveMessage}
            removeItem={this.removeItem.bind(this)}
            saveItinerary={this.saveItinerary.bind(this)}
          />
        </div>
      </div>
    );
  }

  updatePlace(place) {
    this.setState({
      place: place
    });
  }

  updateQuery(query) {
    this.setState({
      place: {},
      query: query,
      itinerary: {},
      saveMessage: ''
    });
  }

  addItem() {
    this.state.itinerary[this.state.place.place_id] = this.state.place;
    this.setState({
      itinerary: this.state.itinerary
    });
  }

  removeItem(key) {
    delete this.state.itinerary[key];
    this.setState({
      itinerary: this.state.itinerary,
      saveMessage: ''
    });
  }

  saveItinerary() {
    const context = this;
    console.log(this.state.query, 'query');

    axios.post('/itinerary', {
      token: localStorage.token,
      itinerary_id: this.state.query.place_id,
      itinerary_name: this.state.query.name,
      place_ids: Object.keys(this.state.itinerary)
    })
    .then(function(res) {
      if (res.status === 200) {
        context.setState({
          saveMessage: 'Saved'
        });
        console.log(context.state.saveMessage);
      }
    })
    .catch(function(error) {
      console.log(error, 'error saving itinerary');
    });
  }
}
