const TO = require('../models/to');

// Display list of all Formats.
exports.to_list = function(req, res, next) {
    TO.find()
        .sort([['descriptor']])
        .exec(function (err, list_tos) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_tos);
        });
};