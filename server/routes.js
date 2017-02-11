const express = require('express');
const bodyParser = require('body-parser');
const userCtrl = require('./db/users/usersController.js');
const itineraryCtrl = require('./db/itinerary/itineraryController.js');
const googleDirections = require('./googleDirections.js');
const routes = express();

//Parse incoming body
routes.use(bodyParser.urlencoded({extended: false}));
routes.use(bodyParser.json());

routes.use(express.static(__dirname + '/../public'));

routes.get('/users/signin', userCtrl.signin);
routes.post('/users/create', userCtrl.create);
routes.get('/users/auth', userCtrl.authenticate);

routes.get('/itinerary', itineraryCtrl.retrieve);
routes.post('/itinerary', itineraryCtrl.save);
routes.delete('/itinerary', itineraryCtrl.delete);
routes.post('/itinerary/mail', itineraryCtrl.sendMail);

routes.get('/orderedPlaces', googleDirections.getOrderedPlaces);

routes.get('/*', function(req, res) {
  res.redirect('/');
});

module.exports = routes;
