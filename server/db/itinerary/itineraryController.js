const Itinerary = require('./itineraryModel.js');
const jwt = require('jsonwebtoken');
let dbconfig = require('../dbconfig.js');
const mail = require('../../../sendgrid.js');

//For testing
const dbconfig = require('../dbconfig.js');

//for prod
// dbconfig = { secret: 'RnPbb8wyxmFwfuCy1glqyjguZ38JyPoo' };

const controller = {
  save: function(req, res, next) {
    const token = req.body.token;
    const place_ids = req.body.place_ids;
    const itinerary_id = req.body.itinerary_id;
    const itinerary_name = req.body.itinerary_name;
    const payload = jwt.verify(token, dbconfig.secret);
    console.log('payload', payload);
    const itineraryItems = [];

    place_ids.forEach(function(place_id) {
      itineraryItems.push({
        place_id: place_id,
        itinerary_id: itinerary_id,
        itinerary_name: itinerary_name,
        user_id: payload.id
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
        user_id: payload.id
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
    const place_ids = req.query.place_ids;
    const payload = jwt.verify(token, dbconfig.secret);

    Itinerary.destroy({
      where: {
        place_id: place_ids,
        user_id: payload.id
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
