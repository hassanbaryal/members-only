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
      return async.parallel(
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
            errors: errors.array(),
            submission: req.body,
            posts: results.posts,
            comments: results.comments,
          });
        }
      );
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
  Comment.deleteMany({ post: req.params.id }).exec((err) => {
    if (err) return next(err);
    return Post.deleteOne({ _id: req.params.id }).exec((error) => {
      if (error) return next(error);
      return res.redirect('/profile/');
    });
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

// Like post on POST
exports.likePost_post = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).exec((err, post) => {
    if (err) return next(err);
    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      return post.save((error) => {
        if (err) return next(error);
        return res.send('Successfully updated (added)!');
      });
    }
    const index = post.likes.findIndex((id) => id === req.user._id);
    post.likes.splice(index, 1);
    return post.save((error) => {
      if (err) return next(error);
      return res.send('Successfully updated (removed)!');
    });
  });
};
