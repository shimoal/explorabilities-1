const Sequelize = require('sequelize');


//For testing only...
// const cfg = require('./dbconfig.js');
//
// const sequelize = new Sequelize(cfg.myLocalDB, cfg.myLocalDBRole, cfg.myLocalDBPW, {
//   host: 'localhost',
//   dialect: 'postgres',
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000
//   }
// });

const db = 'dboi0jrqlk7thd';
const user = 'aqpvvsqdgwsioa';
const pw = '4650ae13e0cfcedfba4199739072196672a689d3258c5581b94c4c3383894df7';

const sequelize = new Sequelize(db, user, pw, {
  host: 'ec2-184-72-252-69.compute-1.amazonaws.com',
  port: 5432,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

module.exports = sequelize;
