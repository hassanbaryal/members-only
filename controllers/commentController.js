const async = require('async');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.createComment_post = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment text required (max 1000 characters)'),
  (req, res, next) => {
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
        console.log(results);
        if (err) return next(err);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.render('postPage', {
            title: `${results.post.title}`,
            post: results.post,
            comments: results.comments,
            errors: errors.array(),
            submission: req.body.text,
          });
        }

        const comment = new Comment({
          text: req.body.text,
          timeStamp: Date.now(),
          user: req.user._id,
          post: req.params.id,
          likes: [],
        });

        return comment.save((error) => {
          if (error) return next(error);
          return res.redirect(`/post/${req.params.id}`);
        });
      }
    );
  },
];

exports.deleteComment_post = (req, res, next) => {
  Comment.findOne({ _id: req.params.id }).exec((err, comment) => {
    if (err) return next(err);
    return comment.delete((error) => {
      if (error) return next()
      return res.redirect(`/post/${comment.post}`);
    })
  });
};
