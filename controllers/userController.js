const User = require('../models/user');
const Team = require('../models/team');
const genPassword = require('../utils/password_utils').genPassword;
const multer = require("multer");
const {validPassword} = require("../utils/password_utils");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const {body} = require("express-validator");
const {getValidationResult} = require("../utils/_helpers");
const unlink = require('node:fs').unlink;

const MAX_FILE_SIZE = 1000000;
const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => cb(null, 'public/images/avatars'),
        filename: (req, file, cb) => cb(null, Date.now() + '-' +file.originalname)
    }
);

const upload = multer({storage: storage, limits: { fileSize: MAX_FILE_SIZE }}).single('file');

exports.upload_user_avatar = function (req, res, next) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError || err) {
            return res.status(500).json({message: err.message})
        }
        let user = req.user;
        const old_img = user.img;
        user.img = req.file.path;
        user.save().then(() => {
            unlink(old_img, (err) => {
                if (err) {return next(err)}
            });
            res.status(200).json({message: 'File upload successful!'});
        }, (err => {return next(err)}));
    })
}

// Display list of all Users.
exports.list_users = function(req, res, next) {
    User.find()
        .sort([['nick']])
        .populate('team')
        .select('nick team img')
        .exec(function (err, list_users) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_users);
        });
};

exports.current_user = function (req, res) {
    if (req.isAuthenticated()) {
        return res.status(200).json({user: {_id: req.user._id, nick: req.user.nick, img: req.user.img, e_mail: req.user.e_mail, team: res.locals.team}});
    } else {
        return res.status(200).send({user: null});
    }
}

exports.edit_user = [
    body('nick', 'Username length (min: 4, max: 20).').isLength({min: 4, max: 20}),
    body('e_mail', 'Invalid e-Mail address!').isEmail(),
    (req, res, next) => {
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            User.findById(req.body._id).exec( function (err, user){
                if (err) { return next(err); }
                if (req.body.password_new !== ''){
                    if (req.body.password_new.length < 4 || req.body.password_new.length > 20){
                        return res.status(409).json({message: 'New password length (min: 4, max: 20)!'});
                    }
                    if (req.body.password_new !== req.body.password_repeat){
                        return res.status(409).json({message: 'Passwords don\'t match!'});
                    }
                    if (!validPassword(req.body.password, user.hash, user.salt)){
                        return res.status(403).json({message: 'Incorrect password!'});
                    }
                    const saltHash = genPassword(req.body.password_new);
                    const salt = saltHash.salt;
                    const hash = saltHash.hash;
                    user.salt = salt;
                    user.hash = hash;
                }
                user.nick = req.body.nick;
                user.e_mail = req.body.e_mail;
                user.team = req.body.team;
                user.save()
                    .then(() => {return res.status(200).json({message: 'Profile updated!'})})
                    .catch(err => res.status(409).json({ message: err.message }));
            });
        }
    }]

exports.delete_user = function(req, res, next){
    User.findById(req.body._id).exec(function(err, user){
        if (err) { return next(err)}
        if (!validPassword(req.body.password, user.hash, user.salt)){
            return res.status(403).json({message: 'Incorrect password!'});
        } else {
            User.findByIdAndRemove(req.body._id).exec((err) => {
                if (err) {return next(err)}
                req.logout();
                return res.status(200).json({message: 'Account closed.'});
            })
        }
    });
}

exports.register_user = [
    body('username', 'Username length (min: 4, max: 20).').isLength({min: 4, max: 20}),
    body('password', 'Password length (min: 8, max: 20).').isLength({min: 8, max: 20}),
    body('e_mail', 'Invalid e-Mail address!').isEmail(),
    (req, res, next) => {
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            User.findOne({$or: [{nick: req.body.username }, {e_mail: new RegExp(`^${req.body.e_mail}$`, 'i')}]})
                .exec((err, user) => {
                    if (err) {return next(err)}
                    if (user){
                        return res.status(409).json({message: 'A user with that name or e-mail already exists.'})
                    } else {
                        if (req.body.password !== req.body.password_repeat){
                            return res.status(409).json({message: 'Passwords don\'t match!'});
                        }
                        const saltHash = genPassword(req.body.password);

                        const salt = saltHash.salt;
                        const hash = saltHash.hash;

                        const newUser = new User({
                            nick: req.body.username,
                            e_mail: req.body.e_mail,
                            hash: hash,
                            salt: salt,
                            team: req.body.team,
                            img: null
                        });

                        newUser.save()
                            .then(() => res.status(200).json({message: 'Registration successful!'}))
                            .catch(err => res.status(409).json({ message: err.message }));
                    }
                })
        }
    }
]

exports.login_failure = (req, res) => {
    return res.status(401).json({ message: 'Incorrect username or password.' });
}

exports.logout = (req, res) => {
    req.logout();
    res.status(200).json({message: 'Logged out!'});
}

exports.forgot_password = function(req, res, next){
    User.findOne({$or: [{nick: req.body.username }, {e_mail: new RegExp(`^${req.body.username}$`, 'i')}]})
        .exec((err, user) => {
            if (err) {return next(err)}
            if (user) {
                const token = crypto.randomBytes(20).toString('hex');
                const mail = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.E_MAIL, // Your email id
                        pass: process.env.PASSWORD // Your password
                    }
                });

                const mailOptions = {
                    from: process.env.E_MAIL,
                    to: user.e_mail,
                    subject: 'Reset Password Link - fabstats.info',
                    html: '<p>Use this <a href="' + process.env.URL +  'reset-password/' + token + '">link</a> to reset your password.</p>'
                };

                mail.sendMail(mailOptions).then(() => {
                        user.token = token;
                        user.save().then(() => {return res.status(200).json({message: 'Reset link sent!'})});
                    }).catch((err) => {return next(err)});
            } else {
                return res.status(401).json({message: 'The user / e-Mail is not registered with us'});
            }
        })
}

exports.reset_password = function(req, res, next){
    User.findOne({token: req.body.token})
        .exec((err, user) => {
            if (err) {return next(err)}
            if (user) {
                if (req.body.password_new !== req.body.password_repeat){
                    return res.status(409).json({message: 'Passwords don\'t match!'});
                }
                const saltHash = genPassword(req.body.password_new);
                const salt = saltHash.salt;
                const hash = saltHash.hash;
                user.salt = salt;
                user.hash = hash;
                user.token = null;
                user.save().then(() => {
                    res.status(200).json({message: 'Password changed!'});
                }).catch((err) => {return next(err)});
            } else {
                return res.status(401).json({message: 'Invalid reset link!'});
            }
        })
}