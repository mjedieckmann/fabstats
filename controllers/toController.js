/**
 * Controller for the TO model.
 * Handles interactions with the database.
 * Related:
 *  ../routes/api.js
 */

const TO = require('../models/to');
const {body} = require("express-validator");
const {getValidationResult} = require("../utils/_helpers");

/**
 * Check if the current authentication is the creator of the TO they are trying to manipulate.
 */
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

/**
 * Returns a list of all TOs.
 */
exports.list_tos = function(req, res, next) {
    TO.find()
        .sort('descriptor')
        .exec(function (err, list_tos) {
            if (err) { return next(err); }
            res.json(list_tos);
        });
};

/**
 * Create a new TO.
 * Sets the current authentication as the creator of the TO.
 */
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
                    // Validation successful, create and save the new TO.
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

/**
 * Edit an existing TO.
 * In middleware chain after isToCreator to ensure that only authorized users can call this function.
 * We use res.locals to pass information between functions in the middleware chain.
 */
exports.edit_to = [
    body('descriptor', 'TO name must not be empty.').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            // Validation successful, edit the TO.
            const to = res.locals.to;
            to.descriptor = req.body.descriptor;
            to.save(function (err, to) {
                if (err) { return next(err); }
                return res.status(200).json({message: 'TO updated!', to: to});
            });
        }
    }
]

/**
 * Delete an existing TO.
 * In middleware chain after isToCreator to ensure that only authorized users can call this function.
 * We use res.locals to pass information between functions in the middleware chain.
 */
exports.delete_to = function (req, res) {
    TO.findByIdAndRemove(req.locals.to._id).then(() => {
        return res.status(200).json({message: "TO deleted!"});
    });
}