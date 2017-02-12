const Itinerary = require('./itineraryModel.js');
const jwt = require('jsonwebtoken');
let dbconfig = require('../dbconfig.js');
const mail = require('../../../sendgrid.js');

//For testing
// const dbconfig = require('../dbconfig.js');

//for prod
dbconfig = { secret: 'RnPbb8wyxmFwfuCy1glqyjguZ38JyPoo' };

const controller = {
  save: function(req, res, next) {
    const token = req.body.token;
    const placeIDs = req.body.placeIDs;
    const itineraryID = req.body.itineraryID;
    const itineraryName = req.body.itineraryName;
    const payload = jwt.verify(token, dbconfig.secret);
    console.log('payload', payload);
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
  retrieve: function(req, res, next) {
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
  delete: function(req, res, next) {
    const token = req.query.token;
    const placeIDs = req.query.placeIDs;
    const payload = jwt.verify(token, dbconfig.secret);

    Itinerary.destroy({
      where: {
        placeID: placeIDs,
        userID: payload.id
      }
    })
    .then(function() {
      res.sendStatus(200);
    })
    .catch(function() {
      console.log('error updating itinerary');
      return res.sendStatus(500);
    });
  },
  sendMail: function(req, res, next) {
    mail.sendMail(req, res, next);
  }
};

module.exports = controller;
