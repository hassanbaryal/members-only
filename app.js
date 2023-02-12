const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./middlewares/passport-config.mw');
const checkAuthenticated = require('./middlewares/checkAuthenticated.mw');
// Import and configure dotenv
require('dotenv').config();

const indexRouter = require('./routes/index');

// Connect to DB
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI || process.env.DEV_DB_URL;
async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => {
  throw new Error(err);
});

const app = express();

initializePassport(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.DEV_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errors = req.session.messages;
  next();
});
app.use(checkAuthenticated);

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
