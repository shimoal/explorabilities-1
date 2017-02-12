const Sequelize = require('sequelize');

//For testing only...
const cfg = require('./dbconfig.js');
const sequelize = new Sequelize(cfg.myLocalDB, cfg.myLocalDBRole, cfg.myLocalDBPW, {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});


// for production

// const db = 'd8cdfa33iutk0d';
// const user = 'nretulfnauybhk';
// const pw = 'fba6aaeb51ea9ef459b8d7932434e50c003995a648bffab4e367afb85cd74e87';

// const sequelize = new Sequelize(db, user, pw, {
//   host: 'ec2-54-221-210-126.compute-1.amazonaws.com',

//   port: 5432,
//   dialect: 'postgres',
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000
//   }
// });

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

module.exports = sequelize;