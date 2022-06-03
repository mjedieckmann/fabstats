const Meta = require('../models/meta');

// Display list of all Formats.
exports.list_metas = function(req, res, next) {
    Meta.find()
        .sort([['date', 'descending']])
        .exec(function (err, list_metas) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_metas);
        });
};