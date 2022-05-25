const User = require('../models/user');
const Team = require('../models/team');
const genPassword = require('../utils/password_utils').genPassword;
const multer = require("multer");
const {validPassword} = require("../utils/password_utils");
const Match = require("../models/match");
const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => cb(null, 'public/images/avatars'),
        filename: (req, file, cb) => cb(null, Date.now() + '-' +file.originalname)
    }
);
const upload = multer({storage: storage}).single('file');

exports.isMatchCreator = function(req, res, next) {
    Match.findOne({
        _id: req.body._id,
        created_by: req.user._id
    }).exec((err, match) => {
      if (err !== null) { return next(err)}
      if (match === null){
          return res.status(401).json({message: "You are not the creator of this match!"});
      } else {
          res.locals.match = match;
          return next();
      }
    });
}


exports.user_current = function (req, res) {
    if (req.isAuthenticated()) {
        return res.status(200).json({user: {_id: req.user._id, nick: req.user.nick, img: req.user.img, e_mail: req.user.e_mail, team: res.locals.team}});
    } else {
        return res.status(200).send({user: null});
    }
}

exports.user_file_upload = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        let user = req.user;
        user.img = req.file.path;
        user.save().then(user => {
            res.status(200).json({message: 'File upload successful!'});
        });
    })
}

// Display list of all Users.
exports.user_list = function(req, res, next) {
    User.find()
        .sort([['nick']])
        .populate('team')
        .exec(function (err, list_users) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_users);
        });
};

// Display detail for one User.
exports.user_detail = function(req, res, next) {
    User.findById(req.params.id)
        .populate({ path: 'team', model: Team})
        .exec(function (err, user) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(user);
        });
};

exports.user_register = function(req, res, next){
    User.findOne({$or: [{nick: req.body.username }, {e_mail: new RegExp(`^${req.body.e_mail}$`, 'i')}]})
        .then((user) => {
            if (user){
                res.status(409).json({message: 'A user with that name or e-mail already exists.'})
            } else {
                if (req.body.password !== req.body.password_repeat){
                    res.status(409).json({message: 'Passwords don\'t match!'});
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

                newUser.save().then(() => next());
            }
        })
        .catch(err => res.status(409).json({ message: 'There was an error when creating the user: ' + err }));
}

// Combine with file upload into one chain? Add team creation to chain.
exports.user_edit = function(req, res, next){
    User.findById(req.body._id).exec( function (err, user){
        if (err) { return next(err); }
        if (req.body.password_new !== ''){
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
        user.team = res.locals.team;
        user.save().then(() => {return res.status(200).json({message: 'Profile updated!'})});
    });
}