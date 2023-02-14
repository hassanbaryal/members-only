const passport = require('passport');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Display login page on GET
exports.login_get = (req, res) => {
  res.render('login', {
    title: 'Members Only',
    username: req.query.username || null,
  });
};

// Authenticate user on POST
exports.login_post = [
  passport.authenticate('local', {
    successRedirect: '/homepage',
    failureRedirect: '/',
    failureMessage: true,
  }),
];

// Display login page on GET
exports.signup_get = (req, res) => {
  res.render('signup', {
    title: 'Members Only',
    errors: null,
    username: null,
  });
};

// Create new user on signup POST
exports.signup_post = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Username is required'),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Password is required'),
  body('confirmPassword')
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return Promise.reject(new Error('Passwords do not match'));
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('signup', {
        title: 'Members Only',
        errors: errors.array(),
        username: req.body.username,
      });
    }

    return User.find({ username: req.body.username }).exec((err, result) => {
      if (err) return next(err);
      if (result.length > 0) {
        return res.render('signup', {
          title: 'Members Only',
          errors: [{ msg: 'Username taken' }],
          username: null,
        });
      }
      return bcrypt.hash(req.body.password, 10, (error, hashedPassword) => {
        if (error) return next(error);

        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          member: false,
        });

        return user.save((errs) => {
          if (errs) return next(errs);
          return res.redirect(
            `/login?title=${encodeURIComponent(
              'Members Only'
            )}&username=${encodeURIComponent(req.body.username)}`
          );
        });
      });
    });
  },
];

// Log user out on GET, redirect to /login
exports.logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect('/login');
  });
};

// Display homepage on GET
exports.homepage_get = (req, res) => {
  res.render('homepage', {
    title: 'Members Only',
  });
};
