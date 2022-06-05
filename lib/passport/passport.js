/**
 * Configuration file for the authentication strategy.
 */

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../../models/user');
const validPassword = require('../../utils/password_utils').validPassword;

/**
 * User verification, checks if authentication credentials are valid.
 */
const verifyCallback = (username, password, done) => {

    User.findOne({$or: [{nick: username }, {e_mail: new RegExp(`^${username}$`, 'i')}]})
        .then((user) => {

            if (!user) { return done(null, false) }

            const isValid = validPassword(password, user.hash, user.salt);

            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });

}

// Turn on authentication verification with local strategy.
passport.use(new LocalStrategy(verifyCallback));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});