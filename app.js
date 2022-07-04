/**
 * Main application file.
 * Loads and configures necessary middleware, connects to the database, defines routes, and default error handling.
 */

/**
 * -------------- APP CONFIG ----------------
 */
const express = require('express');
const path = require('path');
// Needed for sessions
const cookieParser = require('cookie-parser');
// Logging utility
const logger = require('morgan');
// Compress requests for better performance
const compression = require('compression');
// Security measure
const helmet = require('helmet');
// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

const app = express();
app.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "img-src": ["'self'", "https: data: blob:"],
        },
    })
);
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// We store most of the images in this folder. This routing makes sure that the application can find them with a URL.
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/images', express.static('public/images'));

/**
 * -------------- DATABASE CONFIG ----------------
 * */
const MongoStore = require('connect-mongo');
// Set up mongoose connection
const mongoose = require('mongoose');
// Use the DB_STRING environment variable to connect to the production DB (otherwise connect to the local development DB)
const mongoDB = process.env.DB_STRING || "mongodb://localhost:27017";
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true}, () => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    const client = db.getClient();
    /**
     * --------------------------- SESSION SETUP ------------------------------
     * Sessions are required for our authentication method (local authentication / password).
     */
    //
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
     * --------------------- PASSPORT AUTHENTICATION --------------------
     * Related:
     *  ./lib/passport/passport.js
     *  ./utils/password_utils.js
     */
    const passport = require('passport');
    // Need to require the entire Passport config module so app.js knows about it
    require('./lib/passport/passport');

    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/', express.static(path.join(__dirname,"client/build")));

    /**
     * ------------------------- ROUTES -------------------------------
     * /users/* and /api/* are api routes called by the client to request data from the backend.
     * In production, we build the client and place the created files in ./client/build
     * Every call to the server not captured by the api routes will be redirected to this directory (and thus the client).
     * In development, we run a separate client server in parallel to the backend server on a different port in order to
     * allow for quicker code updates.
     */
    const usersRouter = require('./routes/user_routes');
    const apiRouter = require('./routes/api');

    app.use('/users', usersRouter);
    app.use('/api', apiRouter);

    app.get('/*', function(req,res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
    /**
     * -------------- ERROR HANDLING ----------------
     */
    const createError = require('http-errors');

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function(err, req, res) {
        // Only provide error details in development
        if (req.app.get('env') !== 'development'){
            err = {message: 'There was an error!', status: 500};
        }

        // send the error to the client to handle
        return res.status(err.status || 500).json({message: err.message});
    });

});

module.exports = app;



