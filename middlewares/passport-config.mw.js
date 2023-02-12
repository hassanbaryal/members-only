const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const initializePassport = (passport) => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username }).exec((err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect username' });
        return bcrypt.compare(password, user.password, (error, res) => {
          // Passwords match
          if (res) return done(null, user);
          // Passwords do not match
          return done(null, false, { message: 'Incorrect password' });
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id).exec((err, user) => {
      done(err, user);
    });
  });
};

module.exports = initializePassport;
