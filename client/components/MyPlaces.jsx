import React from 'react';
import axios from 'axios';
import bluebird from 'bluebird';
import ItineraryList from './itineraryList.jsx';

export default class MyPlaces extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itineraries: {},
      currentItinerary: {
        name: '',
        places: [],
        coordinates: []
      },
      saveMessage: '',
      removedPlaces: []
    };
  }

  render() {
    return (
      <div id="myPlacesContainer">
        <div id="myPlacesContent" className="clearfix">
          <div>
            <div id="itineraries">
              <div className="clearfix">
                <h3 className="itineraryHeader">Itineraries</h3>
              </div>
              <div id="myplace-itineraries">
                {Object.keys(this.state.itineraries).map((key) => (
                  <button onClick={this.setCurrent.bind(this)} name={key} key={key}>
                    {this.state.itineraries[key].name}
                  </button>
                ))}
              </div>
            </div>

          </div>
          <ItineraryList
            query={this.state.currentItinerary}
            list={this.state.currentItinerary.places}
            saveMessage={this.state.saveMessage}
            // sendMail={this.state.sendMail}
            removeItem={this.removeItem.bind(this)}
            saveItinerary={this.saveItinerary.bind(this)}
            reorderItinerary={this.reorderItinerary.bind(this)}
            emailItinerary={this.emailItinerary.bind(this)}
          />
          <div id="map"></div>
          <div id="map2"></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.getItineraries();
  }

  removeItem(key) {
    var places = this.state.currentItinerary.places;
    var removed = this.state.removedPlaces;

    for (var i = 0; i < places.length; i++) {
      if (places[i].place_id === key) {
        removed.push(places[i].place_id);
        places.splice(i, 1);
      }
    }

    this.setState({
      currentItinerary: this.state.currentItinerary,
      saveMessage: '',
      sendMail: '',
      removedPlaces: removed
    });
  }

  saveItinerary() {

    const context = this;

      axios({method: 'DELETE', url: '/itinerary', params: {
          token: localStorage.token,
          itineraryID: this.state.currentItinerary.place_id,
          itineraryName: this.state.currentItinerary.name,
          placeIDs: this.state.removedPlaces
        }
      })
      .then(function(res) {
        if (res.status === 200) {
          context.setState({
            saveMessage: 'Saved'
          });
        }
      })
      .catch(function(error) {
        console.log(error, 'error saving itinerary');
      });

  }

  reorderItinerary() {

    const context = this;
    const name = this.state.currentItinerary.name;
    const convertToCoordinates = this.convertToCoordinates;

    axios.get('/orderedPlaces', {
      params: {
        places: context.state.currentItinerary.places
      }
    }).then( function (response) {
      console.log('received response!', response);

      var newItinerary = {name: name, places: response.data, coordinates: convertToCoordinates(response.data)};
      context.setState({
        currentItinerary: newItinerary
      });

    }).catch( function (err) {console.log(err);});

  }

  emailItinerary() {
    axios({
      method: 'POST', 
      url: '/itinerary/mail', 
      params: {
          itineraryPlaces: this.state.currentItinerary.places,
          itineraryName: this.state.currentItinerary.name
        }
      })
      .then(function(res) {
        if (res.status === 200) {
          console.log('inside then');
          console.log('Notify email sent', res);
          this.setState({
            sendMail: 'Itinerary sent'
          })
        }
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  setCurrent(e) {
    const key = e.target.name;

    this.setState({
      currentItinerary: this.state.itineraries[key]
    });
  }

  convertToCoordinates(places) {
    return places.map(function(place) {
      return { 
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      };
    });
  }

  getItineraries() {
    const context = this;
    console.log('getItineraries');
    axios.get('/itinerary', {
      params: {
        token: localStorage.token
      }
    })
    .then(function(res) {
      context.buildItineraries(res.data);
    })
    .catch(function(error) {
      console.log(error, 'error retreiving itineraries');
    });
  }

  drawMark() {
    console.log(this.state.itineraries);
  }

  buildItineraries(data) {
    const itineraries = {};
    const context = this;

    this.buildMap(setItineraries);

    function setItineraries(service) {
      let first = true;

      data.forEach((itinerary) => {
        let placeID = itinerary.placeID;
        let key = itinerary.itineraryID;
        let name = itinerary.itineraryName;

        service.getDetails({
          placeId: placeID
        }, (place, status) => {
          if (itineraries[key] === undefined) {
            itineraries[key] = {};
            itineraries[key].name = name;
            itineraries[key].places = [];
          }
          itineraries[key].places.push(place);

          context.setState({
            itineraries: itineraries
          });

          if (first) {
            first = false;
            context.setState({
              currentItinerary: context.state.itineraries[Object.keys(context.state.itineraries)[0]]
            });
          }
          context.drawMark();
        });
      });
    }
  }

  buildMap(callback) {
    const key = 'AIzaSyCBb0bm-_wNIf3oDMi-5PN_zeOf1bRWstI';
    const url = 'https://maps.googleapis.com/maps/api/js?key=' + key + '&libraries=places&callback=initMap';

    window.initMap = initMap;
    const ref = window.document.getElementsByTagName('script')[0];
    // console.log('ref', ref);
    const script = window.document.createElement('script');
    script.src = url;
    // console.log('parentNode', ref.parentNode);
    ref.parentNode.insertBefore(script, ref);
    script.onload = function () {
      this.remove();
    };

    function initMap() {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.775, lng: -122.42 },
        zoom: 8,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      });

      const service = new google.maps.places.PlacesService(map);

      callback(service);
    }
  }
}
