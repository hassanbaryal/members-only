const express = require('express');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/login');
});

// GET login page
router.get('/login', userController.login_get);

// POST login
router.post('/login', userController.login_post);

// GET sign up page
router.get('/signup', userController.signup_get);

// POST sign up page
router.post('/signup', userController.signup_post);

// GET logout
router.get('/logout', userController.logout_get);

// GET homepages
router.get('/homepage', userController.homepage_get);

// GET member page
router.get('/member', userController.member_get);

// POST member form
router.post('/member', userController.member_post);

// GET profile page
router.get('/profile/', userController.profile_get);

// GET profile page (comments)
router.get('/profile/comments', userController.profileComments_get);

// GET profile page of another user
router.get('/profile/:id/', userController.profileUser_get);

// GET profile page (comments) of another user
router.get('/profile/:id/comments', userController.profileUserComments_get);

// POST change like status of post
router.post('/like/post/:id', postController.likePost_post);

// POST change like status of comment
router.post('/like/comment/:id', commentController.likeComment_post);

module.exports = router;
