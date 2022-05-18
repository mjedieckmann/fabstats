const Event = require('../models/event');

// Display list of all events.
exports.event_list = function(req, res, next) {
    Event.find()
        .sort([['descriptor']])
        .populate('to')
        .populate('meta')
        .exec(function (err, list_events) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_events);
        });
};