/**
 * -------------- APP CONFIG ----------------
 */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/images', express.static('public/images'));
/**
 * -------------- DATABASE CONFIG ----------------
 * */
const MongoStore = require('connect-mongo');
//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = process.env.DB_STRING;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const client = db.getClient();

/**
 * -------------- SESSION SETUP ----------------
 */
const session = require('express-session');

app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  store: MongoStore.create({
    client,
    touchAfter: 24 * 3600 // time period in seconds
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14 // Equals 2 weeks (14 days * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
  }
}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
const passport = require('passport');
// Need to require the entire Passport config module so app.js knows about it
require('./lib/passport/passport');

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user_routes');
const catalogRouter = require('./routes/catalog')
const apiRouter = require('./routes/api');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);
app.use('/api', apiRouter);
/**
 * -------------- ERROR HANDLING ----------------
 */
const createError = require('http-errors');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
