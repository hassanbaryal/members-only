const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/login');
});

// GET login page
router.get('/login', userController.login_get);

// GET sign up page
router.get('/signup', userController.signup_get);

// POST sign up page
router.post('/signup', userController.signup_post);

module.exports = router;
