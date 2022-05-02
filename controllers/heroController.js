const Hero = require('../models/hero');
const Match = require("../models/match");
const async = require("async");

// Display list of all Heroes.
exports.hero_list = function(req, res, next) {
    Hero.find()
        .sort([['name']])
        .exec(function (err, list_formats) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_formats);
        });
};

// Display detail for one Hero.
exports.hero_detail = function(req, res, next) {
    async.parallel({
        hero: function(callback) {

            Hero.findById(req.params.id)
                .populate('formats')
                .exec(callback);
        },
        matches: function(callback) {

            Match.find({ $or: [ { 'hero_a' : req.params.id }, { 'hero_b' : req.params.id } ] })
                .populate('hero_a')
                .populate('hero_b')
                .populate('user_a')
                .populate('user_b')
                .populate('event_type')
                .populate('top_cut')
                .populate('format')
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.hero==null) { // No results.
            let err = new Error('Hero not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.json({ hero: results.hero, matches: results.matches } );
    });
};