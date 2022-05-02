const Match = require("../models/match");

// Display list of all Heroes.
exports.match_list = function(req, res, next) {
    Match.find()
        .sort([['date']])
        .populate({ path: 'hero_a', select: 'name -_id' })
        .exec(function (err, list_matches) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_matches);
        });
};