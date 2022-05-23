const TO = require('../models/to');
const {body} = require("express-validator");

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

exports.event_create_to = [
    body('to').trim().escape(),
    (req, res, next) => {
        if (req.body.to === null || req.body.to === ''){
            next();
        }
        TO.find({descriptor: req.body.to}).exec((err, to) => {
            if (to.length === 0) {
                const newTo = new TO({descriptor: req.body.to});
                newTo.save((err) => {
                    if (err) { return next(err)}
                    res.locals.to = newTo;
                    next();
                })
            } else {
                res.locals.to = to[0];
                next();
            }
        })
    }
]