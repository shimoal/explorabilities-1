var { SG_KEY } = require('./keys');
var sg = require('sendgrid')(SG_KEY);
var helper = require('sendgrid').mail;

var sendMail = function(req, res, next) {
  console.log('req places', req.query.itineraryPlaces);
  var userName = 'Will';
  var userEmail = 'wramsey@gmail.com';

  var name = req.query.itineraryName;
  var placesRaw = req.query.itineraryPlaces.map(function(place) {
    return JSON.parse(place);
  });
  var places = placesRaw.map(function(place) {
    return {name: place.name, address: place.formatted_address, website: place.website};
  });
  console.log('name', name, 'places: ', places);


  var from_email = new helper.Email('explore@explorabilities.com');
  var to_email = new helper.Email(userEmail);
  var subject = 'Hello ' + userName + '! Here\'s your explorabilities itinerary';
  var content = new helper.Content(
    'text/html', 'I\'m replacing the <strong>body tag</strong>');
  var mail = new helper.Mail(from_email, subject, to_email, content);
  mail.personalizations[0].addSubstitution(
    new helper.Substitution('-name-', name));
  mail.setTemplateId('0268b91b-f208-4b4d-9b7a-e5d632463b7e');

  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });


  sg.API(request)
  .then(response => {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
    res.send(response).sendStatus(200);
  })
  .catch(error => {
    //error is an instance of SendGridError
    //The full response is attached to error.response
    console.log(error.response);
  });
};

exports.sendMail = sendMail;
