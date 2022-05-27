const Event = require('../models/event');
const {body, validationResult} = require("express-validator");
// Display list of all events.
exports.event_list = function(req, res, next) {
    Event.find()
        .sort([['descriptor']])
        .populate('to')
        .exec(function (err, list_events) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_events);
        });
};

exports.event_create_post = [

    // Validate and sanitize fields.
    body('descriptor', 'Event name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('event_type', 'Event type must not be empty.').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.status(403).json(errors);
        }
        else {
            let event = new Event(
                    {
                        descriptor: req.body.descriptor,
                        event_type: req.body.event_type,
                        to: res.locals.to
                    });
            event.save(function (err) {
                if (err) { return next(err); }
                res.json(event);
            });
        }
    }
];