var cfg = {
<<<<<<< HEAD
  myLocalDB: 'explore',
  myLocalDBRole: '',
  myLocalDBPW: '',
  secret: 'secret'
=======
  myLocalDB: process.env.DATABASE_URL || 'explore',
  myLocalDBRole: '',
  myLocalDBPW: '',
  secret: "secret"
>>>>>>> 5aa046e8f9c12a2fd9e1545580412fd54e087110
};

module.exports = cfg;