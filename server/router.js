const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// I set the session to false so passport doesn't use cookie based Authentication
// since I am using JSON Web Token
const requireAuth = passport.authenticate('jwt', { session: false } );


module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: "there" });
  });
  app.post('/signup', Authentication.signup);
}
