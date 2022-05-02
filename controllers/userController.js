const User = require('../models/user');
const Team = require('../models/team');

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