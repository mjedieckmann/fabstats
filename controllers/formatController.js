/**
 * Controller for the Format model.
 * Handles interactions with the database.
 * Related:
 *  ../routes/api.js
 */

const Format = require('../models/format');

/**
 * Returns a list of all Formats.
 */
exports.list_formats = function(req, res, next) {
    Format.find()
        .sort('descriptor')
        .exec(function (err, list_formats) {
            if (err) { return next(err); }
            res.json(list_formats);
        });
};