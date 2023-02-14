const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');

exports.createPost_post = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('Title is required (max 100 characters)'),
  body('text')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .escape()
    .withMessage('Description/Text is required (max 1000 characters)'),
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body.title, req.body.text);
    if (!errors.isEmpty()) {
      return res.render('homepage', {
        title: 'Members Only Homepage',
        errors: errors.array(),
        submission: req.body,
      });
    }

    const post = new Post({
      title: req.body.title,
      text: req.body.text,
      timeStamp: Date.now(),
      user: req.user._id,
      likes: [],
    });

    return post.save((err) => {
      if (err) return next(err);
      return res.redirect('/homepage');
    });
  },
];
