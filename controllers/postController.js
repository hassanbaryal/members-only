const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');

// Create post on POST
exports.createPost_post = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required (max 100 characters)'),
  body('text')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description/Text is required (max 1000 characters)'),
  (req, res, next) => {
    const errors = validationResult(req);

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

// Delete post on POST
exports.deletePost_post = (req, res, next) => {
  console.log(req.params.id, req.url);
  Post.deleteOne({ _id: req.params.id }).exec((err) => {
    if (err) return next(err);
    return res.redirect('back');
  });
};
