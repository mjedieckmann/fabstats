const TO = require('../models/to');
const {body, validationResult} = require("express-validator");
const Event = require("../models/event");

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

exports.create_to = [
    body('descriptor', 'TO name must not be empty.').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            return res.status(403).json(errors);
        }
        TO.findOne({ descriptor: req.body.descriptor}).exec((err, to) => {
            if (to) {
                return res.status(403).json({message: 'A TO with that name already exists!'})
            } else {
                const newTo = new TO({
                    descriptor: req.body.descriptor,
                    created_by: req.user._id
                });
                newTo.save((err) => {
                    if (err) { return next(err)}
                    return res.status(200).json(newTo);
                })
            }
        })
    }
]

exports.edit_to = [
    // Validate and sanitize fields.
    body('descriptor', 'Event name must not be empty.').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        TO.findById(req.body._id).exec((err, to) => {
            if (err) { return next(err); }
            to.descriptor = req.body.descriptor;
            to.save(function (err, to) {
                if (err) { return next(err); }
                return res.status(200).json(to);
            });
        })
    }
]

exports.delete_to = function (req, res) {
    TO.findByIdAndRemove(req.body._id).then(() => {
        return res.status(200).json({message: "TO deleted!"});
    });
}