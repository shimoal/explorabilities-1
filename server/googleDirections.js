var http = require ('http');
var request = require ('request');

var options = {
  host: 'www.google.com',
  path: '/index.html'
};


const key = 'AIzaSyCl4ti5A7doCTeKueFxItSZEYldlU8W_Q4';


var getOrderedPlaces = function(req, res, next) {
  console.log('inside getOrderedPlaces');

  request('https://maps.googleapis.com/maps/api/directions/json?origin=Boston,MA&destination=Concord,MA&waypoints=Charlestown,MA|Lexington,MA&key='+key, 
    function(error, response, body) {
      console.log('inside request');
      console.log(error);
      console.log(response);
      console.log(body);
      res.send('done');
    });
};


module.exports.getOrderedPlaces = getOrderedPlaces;