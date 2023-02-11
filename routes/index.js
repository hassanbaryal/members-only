const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/login');
});

// GET login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Members Only' });
});

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Members Only' });
});

module.exports = router;
