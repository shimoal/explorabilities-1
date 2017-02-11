import {axios} from 'axios';

var findPath = function(places) {

  const key = 'AIzaSyCl4ti5A7doCTeKueFxItSZEYldlU8W_Q4';

  console.log('inside findPath', places);
  axios.get('/orderedPlaces').then( function (response) {
    console.log('received response!');
  }).catch( function (err) {console.log(err);});

  // places.forEach(function (place) {
  //   console.log(place.geometry.location.lat());
  //   console.log(place.geometry.location.lng());
  // });
};

module.exports = {findPath: findPath};