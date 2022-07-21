/**
 * Controller for the Hero model.
 * Handles interactions with the database.
 * Related:
 *  ../routes/api.js
 */

const Hero = require('../models/hero');

/**
 * Returns a list of all Heroes.
 */
exports.list_heroes = function(req, res, next) {
    Hero.find()
        .sort('name')
        .populate({ path: 'formats' })
        .exec(function (err, list_formats) {
            if (err) { return next(err); }
            res.json(list_formats);
        });
};