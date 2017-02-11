var http = require ('http');
var request = require ('request');

const key = 'AIzaSyCl4ti5A7doCTeKueFxItSZEYldlU8W_Q4';


var getOrderedPlaces = function(req, res, next) {


  // var places = req.query.places.map(function (placeString) {
  //   console.log('string?:', placeString);
  //   return JSON.parse(placeString);
  // });
  //   console.log('inside getOrderedPlaces', places);

  request('https://maps.googleapis.com/maps/api/directions/json?origin=place_id:ChIJHTh6AxauPIgRA5wb30xqq40&destination=place_id:ChIJHTh6AxauPIgRA5wb30xqq40&waypoints=optimize:true|place_id:ChIJ0ddXY0CuPIgRESjalhDyTPk|place_id:ChIJzQ_7XDyuPIgReuoJA541_NA&key='+key, 
    function(error, response, body) {
      if (error) {
        console.log('error:', error);
      }
      console.log('response:', response);
      console.log('body', body);
      console.log('inside request');
      res.send('done');
    });
};


module.exports.getOrderedPlaces = getOrderedPlaces;