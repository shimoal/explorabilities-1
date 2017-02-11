const User = require('./usersModel.js');
const jwt = require('jsonwebtoken');
const dbconfig = require('../dbconfig.js');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

var facebookUsers = [];

passport.use(new FacebookStrategy ({
  clientID: '245626952548730',
  clientSecret: '818aab23b2583296f8dc9ddf3960b3f8',
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email']
},
  function(accessToken, refreshToken, profile, cb) {
    console.log('profile', profile);
    console.log('profile.email', profile.emails[0].value);
    var user = {email: profile.emails[0].value, password: profile.id};
    console.log('user made by facebook profile ', user);
    cb(null, user);
  }
));

passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  for (var i = 0; i < facebookUsers.length; i++) {
    var user = facebookUsers[i];
    if (user === id) {
      return done(null, user);
    }
  }
  done('There is no user.');
});



const controller = {
  signin: function(req, res, next) {
    //Retrieve user from DB and authenticate
    User.findOne({
      where: {
        email: req.query.email
      }
    }).then(function(user) {
      console.log('signin user', user);
      if (user && User.validatePW(req.query.password, user.password)) {
        //First argument in jwt.sign is the 'payload' which is used when saving an itinerary for the user
        const token = jwt.sign({ user: user.email, id: user.id }, dbconfig.secret, {
          expiresIn: 86400 // expires in 24 hours
        });

        return res.json({
          success: true,
          token: token
        });
      }
      return res.status(403).send('Invalid e-mail or password');
    });
  },

  facebook: passport.authenticate('facebook'),
  
  create: function(req, res, next) {
    const password = User.generateHash(req.body.password);
    User.findOrCreate({
      where: {
        email: req.body.email
      },
      defaults: {
        password: password
      }
    }).spread(function(user, created) {
      if (created) {
        console.log('User was successfully created');
        const token = jwt.sign({ user: user.email, id: user.id }, dbconfig.secret, {
          expiresIn: 86400 // expires in 24 hours
        });

        return res.json({
          success: true,
          token: token
        });
      } else {
        return res.sendStatus(500);
      }
    }).catch(function(err) {
      if (err.original.code === '23505') {
        return res.status(403).send('That email address already exists, please login');
      }
      return res.sendStatus(500);
    });

  },

  authenticate: function(req, res) {
    // console.log('------------------------', req.session.user);
    let token = req.headers.token;
    jwt.verify(token, dbconfig.secret, function(err, payload) {
      if (err) {
        res.status(403).send('Invalid authentication token');
      } else {
        res.status(200).send({user: payload.user, id: payload.id});
      }
    });
  },

  facebook: passport.authenticate('facebook', {scope: 'email'}),

  facebookCallback: passport.authenticate('facebook', { 
    // session: false,
    failureRedirect: '/login' }),

  facebookCallback2: function(req, res) {
    console.log('facebookCallback2', 'login success', 'req.user', req.user);
    // Successful authentication, redirect home.
    var facebook = req.user;
    User.findOne({
      where: {
        email: facebook.email
      }
    }).then(function(user) {
      console.log('facebookCallback2', facebook);
      if (user) {
      //First argument in jwt.sign is the 'payload' which is used when saving an itinerary for the user
        console.log('this user already signed in ', facebook);
        const token = jwt.sign({ user: user.email, id: user.id }, dbconfig.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.cookie('token', token);
        // return res.json({
        //   success: true,
        //   token: token
        // });
        res.redirect('/explore');
      } else {
        console.log('this user is new ', facebook);
        const password = facebook.password;
        User.findOrCreate({
          where: {
            email: facebook.email
          },
          defaults: {
            password: password
          }
        }).spread(function(user, created) {
          if (created) {
            console.log('User was successfully created', created);
            const token = jwt.sign({ user: user.email, id: user.id }, dbconfig.secret, {
              expiresIn: 86400 // expires in 24 hours
            });

            // return res.json({
            //   success: true,
            //   token: token
            // });
            res.cookie('token', token);
            res.redirect('/explore');
          } else {
            return res.sendStatus(500);
          }
        }).catch(function(err) {
          if (err.original.code === '23505') {
            return res.status(403).send('That email address already exists, please login');
          }
          return res.sendStatus(500);
        });
      }
    });
  }
};

module.exports = controller;
