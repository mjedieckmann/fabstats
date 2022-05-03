const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../../models/user');
const validPassword = require('../../utils/password_utils').validPassword;


const verifyCallback = (username, password, done) => {

    User.findOne({$or: [{nick: username }, {e_mail: username}]})
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