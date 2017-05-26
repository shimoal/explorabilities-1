import {axios} from 'axios';

var findPath = function(places) {

  const key = 'AIzaSyCl4ti5A7doCTeKueFxItSZEYldlU8W_Q4';

  console.log('inside findPath', places);
  axios.get('/orderedPlaces').then( function (response) {
    console.log('received response!');
  }).catch( function (err) {console.log(err);});

};

module.exports = {findPath: findPath};