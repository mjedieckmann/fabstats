const Format = require('../models/format');

// Display list of all Formats.
exports.format_list = function(req, res, next) {
    Format.find()
        .sort([['descriptor']])
        .exec(function (err, list_formats) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_formats);
        });
};

// Display list of all Formats.
exports.format_detail = function(req, res, next) {
    Format.findById(req.params.id)
        .exec(function (err, format) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(format);
        });
};