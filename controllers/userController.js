const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');

// Display login page on GET
exports.login_get = (req, res) => {
  res.render('login', { title: 'Members Only' });
};

// Display login page on GET
exports.signup_get = (req, res) => {
  res.render('signup', { title: 'Members Only' });
};
