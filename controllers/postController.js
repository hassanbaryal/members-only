const async = require('async');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

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
      return Post.find({})
        .populate('user')
        .sort({ timeStamp: -1 })
        .exec((err, posts) => {
          if (err) return next(err);
          console.log(posts);
          return res.render('homepage', {
            title: 'Members Only Homepage',
            errors: errors.array(),
            submission: req.body,
            posts,
          });
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

// Display post page on GET
exports.postPage_get = (req, res, next) => {
  async.parallel(
    {
      post(cb) {
        Post.findOne({ _id: req.params.id }).populate('user').exec(cb);
      },
      comments(cb) {
        Comment.find({ post: req.params.id })
          .populate('user')
          .populate('likes')
          .exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      return res.render('postPage', {
        title: `${results.post.title}`,
        post: results.post,
        comments: results.comments,
        errors: null,
        submission: null,
      });
    }
  );
};
