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
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    // console.log('cb', cb);

    // console.log('facebookUsers', facebookUsers);
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    if (facebookUsers.indexOf(profile.id) !== -1) {
      return cb(null, facebookUsers[facebookUsers.indexOf(profile.id)]);
    }
    var newUser = profile.id;
    facebookUsers.push(newUser);
    cb(null, newUser);
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
    console.log('req********************', req.user);
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
    console.log('facebookCallback2', 'login success');
    // Successful authentication, redirect home.
    res.redirect('/facebookWelcome');
  },

  facebookWelcome: function(req, res) {
    res.send('facebookWelcome');
  }
};

module.exports = controller;
