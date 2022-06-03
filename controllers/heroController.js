const Hero = require('../models/hero');

// Display list of all Heroes.
exports.list_heroes = function(req, res, next) {
    Hero.find()
        .sort([['name']])
        .exec(function (err, list_formats) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_formats);
        });
};