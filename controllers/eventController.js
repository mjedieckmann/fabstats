const Event = require('../models/event');
const {body, validationResult} = require("express-validator");
const {getValidationResult} = require("../utils/_helpers");

exports.isEventCreator = function(req, res, next) {
    Event.findOne({
        _id: req.body._id,
        created_by: req.user._id
    }).exec((err, event) => {
        if (err !== null) { return next(err)}
        if (event === null){
            return res.status(401).json({message: "You are not the creator of this event!"});
        } else {
            res.locals.event = event;
            return next();
        }
    });
}

// Display list of all events.
exports.list_events = function(req, res, next) {
    Event.find()
        .sort([['descriptor']])
        .populate('to')
        .exec(function (err, list_events) {
            if (err) { return next(err); }
            res.json(list_events);
        });
};

exports.create_event = [
    // Validate and sanitize fields.
    body('descriptor', 'Event name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('event_type', 'Event type must not be empty.').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            Event.findOne({descriptor: req.body.descriptor}).exec((err, event) =>{
                if (err) {return next(err)}
                if (event) {
                    return res.status(403).json({message: 'An Event with that name already exists!'})
                } else {
                    const newEvent = new Event(
                        {
                            descriptor: req.body.descriptor,
                            event_type: req.body.event_type,
                            to: req.body.to,
                            created_by: req.user
                        });
                    newEvent.save((err) => {
                        if (err) { return next(err); }
                        Event.populate(newEvent, [
                            { path: 'to', select: 'descriptor' },
                        ]).then((populatedEvent) => res.status(200).json({message: 'Event "' + populatedEvent.descriptor + '" created!', event: populatedEvent})
                        , (err) => next(err));
                    });
                }
            })
        }
    }
];

exports.edit_event = [
    // Validate and sanitize fields.
    body('descriptor', 'Event name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('event_type', 'Event type must not be empty.').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            const event = res.locals.event;
            event.descriptor = req.body.descriptor;
            event.event_type = req.body.event_type;
            event.to = req.body.to;
            event.save(function (err, event) {
                if (err) { return next(err); }
                Event.populate(event, [
                    { path: 'to', select: 'descriptor' },
                ]).then((populatedEvent) => res.status(200).json({message: 'Event updated!', event: populatedEvent})
                    , (err) => next(err));
            });
        }
    }
]

exports.delete_event = function (req, res) {
    Event.findByIdAndRemove(req.body._id).then(() => {
        return res.status(200).json({message: 'Event deleted!'});
    });
}