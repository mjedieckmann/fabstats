/**
 * Controller for the Event model.
 * Handles interactions with the database.
 * Related:
 *  ../routes/api.js
 */

const Event = require('../models/event');
const {body} = require("express-validator");
const {getValidationResult} = require("../utils/_helpers");

/**
 * Check if the current authentication is the creator of the Event they are trying to manipulate.
 */
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

/**
 * Returns a list of all Events.
 */
exports.list_events = function(req, res, next) {
    Event.find()
        .sort('descriptor')
        .populate('to')
        .populate('created_by')
        .exec(function (err, list_events) {
            if (err) { return next(err); }
            res.json(list_events);
        });
};

/**
 * Create a new Event.
 * Sets the current authentication as the creator of the Event.
 */
exports.create_event = [
    body('descriptor', 'Event name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('event_type', 'Event type must not be empty.').trim().isLength({ min: 1 }).escape(),
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
                    // Validation successful, create and save the new Event.
                    const newEvent = new Event(
                        {
                            descriptor: req.body.descriptor,
                            event_type: req.body.event_type,
                            to: req.body.to,
                            created_by: req.user
                        });
                    newEvent.save((err) => {
                        if (err) { return next(err); }
                        // Populate to include more details than just the id of referenced object.
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

/**
 * Edit an existing Event.
 * In middleware chain after isEventCreator to ensure that only authorized users can call this function.
 * We use res.locals to pass information between functions in the middleware chain.
 */
exports.edit_event = [
    body('descriptor', 'Event name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('event_type', 'Event type must not be empty.').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            // Validation successful, edit the Event.
            const event = res.locals.event;
            event.descriptor = req.body.descriptor;
            event.event_type = req.body.event_type;
            event.to = req.body.to;
            event.save(function (err, event) {
                if (err) { return next(err); }
                // Populate to include more details than just the id of referenced object.
                Event.populate(event, [
                    { path: 'to', select: 'descriptor' },
                ]).then((populatedEvent) => res.status(200).json({message: 'Event updated!', event: populatedEvent})
                    , (err) => next(err));
            });
        }
    }
]

/**
 * Delete an existing Event.
 * In middleware chain after isEventCreator to ensure that only authorized users can call this function.
 * We use res.locals to pass information between functions in the middleware chain.
 */
exports.delete_event = function (req, res, next) {
    Event.findByIdAndRemove(res.locals.event._id).exec((err) => {
        if (err) {return next(err)}
        return res.status(200).json({message: 'Event deleted!'});
    });
}