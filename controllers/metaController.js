/**
 * Controller for the Meta model.
 * Handles interactions with the database.
 * Related:
 *  ../routes/api.js
 */

const Meta = require('../models/meta');

/**
 * Returns a list of all Metas.
 */
exports.list_metas = function(req, res, next) {
    Meta.find()
        .sort('date')
        .exec(function (err, list_metas) {
            if (err) { return next(err); }
            res.json(list_metas);
        });
};