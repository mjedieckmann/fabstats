const Format = require('../models/format');

// Display list of all Formats.
exports.list_formats = function(req, res, next) {
    Format.find()
        .sort([['descriptor']])
        .exec(function (err, list_formats) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_formats);
        });
};