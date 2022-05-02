const EventType = require('../models/eventtype');

// Display list of all Formats.
exports.event_type_list = function(req, res, next) {
    EventType.find()
        .sort([['descriptor']])
        .exec(function (err, list_event_types) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_event_types);
        });
};