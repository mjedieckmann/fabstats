const User = require('../models/user');
const Team = require('../models/team');
const genPassword = require('../utils/password_utils').genPassword;

// Display list of all Users.
exports.user_list = function(req, res, next) {
    User.find()
        .sort([['nick']])
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
    const saltHash = genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        nick: req.body.username,
        e_mail: req.body.e_mail,
        hash: hash,
        salt: salt,
        team: req.body.team
    });

    newUser.save()
        .then(() => res.redirect('/users/login'))
        .catch(err => res.status(409).json({ msg: 'There was an error when creating the user: ' + err }));
}