var http = require ('http');
var request = require ('request');

const key = 'AIzaSyCl4ti5A7doCTeKueFxItSZEYldlU8W_Q4';


var getOrderedPlaces = function(req, res, next) {
  var places = '';

  var placeObjects = req.query.places.map(function (placeString) {
    return JSON.parse(placeString);
  });

  var placeIds = placeObjects.map( function (place) {
    return place.place_id;
  });

  //currently, will start and end at last point in the list. 
  //Fix this later to allow user to enter their own start/end point.

  var startingPointId = placeIds.pop();
  var startingPointObject = placeObjects.pop();

  placeIds.forEach(function (placeId) {
    places += '|place_id:' + placeId;
  });

  request('https://maps.googleapis.com/maps/api/directions/json?' +
          'origin=place_id:' + startingPointId + 
          '&destination=place_id:' + startingPointId + 
          '&waypoints=optimize:true'  + places + 
          '&key='+ key, 
    function(error, response, body) {
      if (error) {
        console.log('error:', error);
      }

      var body = JSON.parse(body);

      //returns an array of indices of the optimal order
      var waypoints = body.routes[0].waypoint_order;
      var orderedPlaces = new Array(waypoints.length);

      for (var i = 0; i < waypoints.length; i++) {
        orderedPlaces[waypoints[i]] = placeObjects[i];
      }
      orderedPlaces.unshift(startingPointObject);

      res.send(orderedPlaces);
    });
};


module.exports.getOrderedPlaces = getOrderedPlaces;