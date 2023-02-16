const passport = require('passport');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const async = require('async');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

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
    .isAlphanumeric()
    .escape()
    .withMessage('Username is required (letters and numbers only)'),
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
exports.homepage_get = (req, res, next) => {
  async.parallel(
    {
      posts(cb) {
        Post.find({}).populate('user').sort({ timeStamp: -1 }).exec(cb);
      },
      comments(cb) {
        Comment.find({}).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      return res.render('homepage', {
        title: 'Members Only Homepage',
        errors: null,
        submission: req.body,
        posts: results.posts,
        comments: results.comments,
      });
    }
  );
};

// Display member page on GET
exports.member_get = (req, res) => {
  res.render('member', {
    title: 'Become a Member!',
    errors: null,
  });
};

// Modify user member status on POST
exports.member_post = [
  body('code')
    .trim()
    .equals(process.env.MEMBER_PASS || process.env.DEV_MEMBER_PASS)
    .escape()
    .withMessage('Incorrect code'),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('member', {
        title: 'Become a Member!',
        errors: errors.array(),
      });
    }

    return User.findOneAndUpdate({ _id: req.user._id }, { member: true }).exec(
      (err) => {
        if (err) return next(err);

        return res.redirect('/homepage');
      }
    );
  },
];

// Display profile page on GET
exports.profile_get = (req, res, next) => {
  async.parallel(
    {
      posts(cb) {
        Post.find({ user: req.user._id })
          .populate('user')
          .sort({ timeStamp: -1 })
          .exec(cb);
      },
      comments(cb) {
        Comment.find({}, 'post').exec(cb);
      },
    },
    (error, results) => {
      if (error) return next(error);
      return res.render('profile', {
        title: 'Profile Page',
        user: null,
        commentsPage: false,
        posts: results.posts,
        comments: results.comments,
      });
    }
  );
};

// Display profile page with all comments on GET
exports.profileComments_get = (req, res, next) => {
  Comment.find({ user: req.user._id })
    .populate('post')
    .populate('user')
    .sort({ timeStamp: -1 })
    .exec((err, comments) => {
      if (err) return next(err);
      return res.render('profile', {
        title: 'Profile Page',
        user: null,
        commentsPage: true,
        posts: [],
        comments,
      });
    });
};

// Display profile page of another user
exports.profileUser_get = (req, res, next) => {
  console.log(req.params.id === req.user._id.toString());
  if (req.params.id === req.user._id.toString())
    return res.redirect('/profile/');
  return async.parallel(
    {
      user(cb) {
        User.findOne({ _id: req.params.id }).exec(cb);
      },
      posts(cb) {
        Post.find({ user: req.params.id })
          .populate('user')
          .sort({ timeStamp: -1 })
          .exec(cb);
      },
      comments(cb) {
        Comment.find({}, 'post').exec(cb);
      },
    },
    (error, results) => {
      if (error) return next(error);
      return res.render('profile', {
        title: 'Profile Page',
        user: results.user,
        commentsPage: false,
        posts: results.posts,
        comments: results.comments,
      });
    }
  );
};

// Display profile page (comments) of another user on GET
exports.profileUserComments_get = (req, res, next) =>
  async.parallel(
    {
      user(cb) {
        User.findOne({ _id: req.params.id }).exec(cb);
      },
      comments(cb) {
        Comment.find({ user: req.params.id })
          .populate('post')
          .populate('user')
          .sort({ timeStamp: -1 })
          .exec(cb);
      },
    },
    (error, results) => {
      if (error) return next(error);
      return res.render('profile', {
        title: 'Profile Page',
        user: null,
        commentsPage: true,
        posts: [],
        comments: results.comments,
      });
    }
  );
