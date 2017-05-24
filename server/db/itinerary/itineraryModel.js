const Sequelize = require('sequelize');
const db = require('../database.js');
const User = require('../users/usersModel.js');

const Itinerary = db.define('itinerary', {
  place_id: {
    type: Sequelize.STRING
  },
  itinerary_id: {
    type: Sequelize.STRING
  },
  itinerary_name: {
    type: Sequelize.STRING
  },
  user_id: {
    type: Sequelize.INTEGER,
    model: 'users',
    key: 'id'
  }
});

User.hasMany(Itinerary);

db.sync();

module.exports = Itinerary;
