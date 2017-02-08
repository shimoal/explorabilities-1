const Itinerary = require('./itineraryModel.js');
const jwt = require('jsonwebtoken');
const dbconfig = require('../dbconfig.js');

const controller = {
  save: function(req, res, next) {
    const token = req.body.token;
    const placeIDs = req.body.placeIDs;
    const itineraryID = req.body.itineraryID;
    const itineraryName = req.body.itineraryName;
    const payload = jwt.verify(token, dbconfig.secret);
    const itineraryItems = [];

    placeIDs.forEach(function(placeID) {
      itineraryItems.push({
        placeID: placeID,
        itineraryID: itineraryID,
        itineraryName: itineraryName,
        userID: payload.id
      });
    });

    Itinerary.bulkCreate(itineraryItems)
    .then(function() {
      return res.status(200).send('Itinerary successfully saved.');
    })
    .catch(function(err) {
      console.log(err, 'error creating itinerary');
      return res.sendStatus(500);
    });

  },
  retreive: function(req, res, next) {
    const token = req.query.token;
    const payload = jwt.verify(token, dbconfig.secret);
    console.log(payload.id);

    Itinerary.findAll({
      where: {
        userID: payload.id
      }
    })
    .then(function(itineraries) {
      res.json(itineraries);
    })
    .catch(function(err) {
      console.log(err, 'error creating itinerary');
      return res.sendStatus(500);
    });
  },
  update: function(req, res, next) {



    Itinerary.bulkCreate(itineraryItems).then(function() {
      return Itinerary.update(
        { status: 'inactive' }, /* set attributes' value */,
        { where: { subject: 'programming' }} /* where criteria */
      );
    }).spread(function(affectedCount, affectedRows) {
      // .update returns two values in an array, therefore we use .spread
      // Notice that affectedRows will only be defined in dialects which support returning: true

      // affectedCount will be 2
      return Itinerary.findAll();
    }).then(function(itineraries) {
      console.log(itineraries) 
    })    
    .catch(function() {
      console.log(err, 'error updating itinerary');
      return res.sendStatus(500);
    });
  }
};

module.exports = controller;
