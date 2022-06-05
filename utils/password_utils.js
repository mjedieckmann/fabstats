/**
 * Utility functions related to authentication and passwords.
 */

const crypto = require('crypto');

/**
 * Generate salt and hash from a password, which is what we end up storing in the database.
 */
function genPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}

/**
 * Checks if a password is valid by comparing it to the salt and hash that is taken from the database.
 */
function validPassword(password, hash, salt) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

/**
 * Checks if the authentication is authenticated and throws and error if they are not.
 */
function isAuth(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).json({ message: 'You need to be logged in to do this!' });
    }
}

/**
 * Checks if the authentication is already logged in and throws an error if they are (preventing multiple attempts to log in).
 */
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return res.status(200).json({ message: 'You are already logged in' });
    }
    return next();
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.isAuth = isAuth;
module.exports.isLoggedIn = isLoggedIn;