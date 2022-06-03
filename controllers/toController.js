const TO = require('../models/to');
const {body} = require("express-validator");
const {getValidationResult} = require("../utils/_helpers");

exports.isToCreator = function(req, res, next) {
    TO.findOne({
        _id: req.body._id,
        created_by: req.user._id
    }).exec((err, to) => {
        if (err !== null) { return next(err)}
        if (to === null){
            return res.status(401).json({message: "You are not the creator of this TO!"});
        } else {
            res.locals.to = to;
            return next();
        }
    });
}

// Display list of all Formats.
exports.list_tos = function(req, res, next) {
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
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            TO.findOne({descriptor: req.body.descriptor}).exec((err, to) => {
                if (to) {
                    return res.status(403).json({message: 'A TO with that name already exists!'})
                } else {
                    const newTo = new TO({
                        descriptor: req.body.descriptor,
                        created_by: req.user
                    });
                    newTo.save((err) => {
                        if (err) {return next(err)}
                        return res.status(200).json({message: 'TO "' + newTo.descriptor + '" created!', to: newTo});
                    })
                }
            })
        }
    }
]

exports.edit_to = [
    // Validate and sanitize fields.
    body('descriptor', 'TO name must not be empty.').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            TO.findById(req.body._id).exec((err, to) => {
                if (err) { return next(err); }
                to.descriptor = req.body.descriptor;
                to.save(function (err, to) {
                    if (err) { return next(err); }
                    return res.status(200).json({message: 'TO updated!', to: to});
                });
            })
        }
    }
]

exports.delete_to = function (req, res) {
    TO.findByIdAndRemove(req.body._id).then(() => {
        return res.status(200).json({message: "TO deleted!"});
    });
}