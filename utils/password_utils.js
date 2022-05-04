const crypto = require('crypto');

function genPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}

function validPassword(password, hash, salt) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

function isAuth(req, res, next){
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to view this resource' });
    }
}

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        res.status(200).json({ msg: 'You are already logged in' });
    }
    next();
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.isAuth = isAuth;
module.exports.isLoggedIn = isLoggedIn;