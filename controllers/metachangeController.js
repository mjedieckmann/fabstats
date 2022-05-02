const MetaChange = require('../models/metachange');

// Display list of all Formats.
exports.meta_change_list = function(req, res, next) {
    MetaChange.find()
        .sort([['date', 'descending']])
        .exec(function (err, list_event_types) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_event_types);
        });
};