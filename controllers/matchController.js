/**
 * Controller for the Match model.
 * Handles interactions with the database.
 * Related:
 *  ../routes/api.js
 */

const Match = require("../models/match");
const {body} = require("express-validator");
const {getValidationResult} = require("../utils/_helpers");

function sortMatches(a, b) {
    let round_a = parseInt(a.round);
    let round_b = parseInt(b.round);
    if (!isNaN(round_a) && !isNaN(round_b)){
        if (round_a < round_b) {return -1;}
        if (round_a > round_b) {return 1;}
    } else if (isNaN(round_a) && isNaN(round_b)){
        if ('N/A' === a.round){
            return 1;
        } else if ('N/A' === b.round) {
            return -1;
        } else if ('Final' === a.round){
            return 1;
        } else if ('Final' === b.round) {
            return -1;
        } else if ('Semifinal' === a.round){
            return 1;
        } else if ('Semifinal' === b.round) {
            return -1;
        } else if ('Quarterfinal' === a.round){
            return 1;
        } else if ('Quarterfinal' === b.round) {
            return -1;
        }
    } else if (isNaN(round_a)) {
        return 1;
    } else if (isNaN(round_b)) {
        return -1;
    }
    return 0;
}

/**
 * Check if the current authentication is the creator of the Match they are trying to manipulate.
 */
exports.isMatchCreator = function(req, res, next) {
    Match.findOne({
        _id: req.body._id,
        created_by: req.user._id
    }).exec((err, match) => {
        if (err !== null) { return next(err)}
        if (match === null){
            return res.status(401).json({message: "You are not the creator of this match!"});
        } else {
            res.locals.match = match;
            return next();
        }
    });
}

/**
 * Returns a list of all Matches.
 * Populate to include more details than just the id of referenced objects.
 */
exports.list_matches = function(req, res, next) {
    Match.find()
        .sort('event')
        .populate({ path: 'hero_winner', select: 'name img' })
        .populate({ path: 'hero_loser', select: 'name img' })
        .populate({
            path: 'user_winner',
            select: 'nick e_mail img _id',
            populate:
                [
                    {
                        path: 'team',
                        model: 'Team'
                    }
                ]
        })
        .populate({
            path: 'user_loser',
            select: 'nick e_mail img _id',
            populate:
                [
                    {
                        path: 'team',
                        model: 'Team'
                    }
                ]
        })
        .populate({
        path: 'event',
        populate:
            [
                {
                    path: 'to',
                    model: 'TO',
                }
            ]
        })
        .populate({ path: 'meta', select: 'descriptor' })
        .populate({ path: 'format', select: 'descriptor -_id' })
        .exec(function (err, list_matches) {
            if (err) { return next(err); }
            // res.json(list_matches.sort(sortMatches));
            res.status(200).json(list_matches);
        });
};

/**
 * Returns a single Match.
 * Populate to include more details than just the id of referenced objects.
 */
exports.get_match = function (req, res, next){
    Match.findById(req.params.id)
        .populate({ path: 'hero_winner', select: 'name img' })
        .populate({ path: 'hero_loser', select: 'name img' })
        .populate({ path: 'user_winner', select: 'nick img' } )
        .populate({ path: 'user_loser', select: 'nick img' } )
        .populate({
            path: 'event',
            populate:
                [
                    {
                        path: 'to',
                        model: 'TO'
                    },
                    {
                        path: 'created_by',
                        model: 'User'
                    }
                ]
        })
        .populate({ path: 'meta', select: 'descriptor' })
        .populate({ path: 'format', select: 'descriptor' })
        .exec((err, match) => {
        if (err) { return next(err); }
        res.status(200).json(match);
    })
}

/**
 * Create a new Match.
 * Sets the current authentication as the creator of the Match.
 */
exports.create_match = [
    body('date', 'Invalid date of birth.').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('round', 'Round must not be empty.').isString(),
    body('hero_winner', 'Hero (winner) must not be empty.').isObject(),
    body('hero_loser', 'Hero (loser) must not be empty.').isObject(),
    body('format', 'Format must not be empty.').isObject(),
    body('meta', 'Meta must not be empty.').isObject(),
    (req, res, next) => {
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            // Validation successful, create and save the new Match.
            let match = new Match(
                {
                    date: req.body.date,
                    event: req.body.event,
                    round: req.body.round,
                    hero_winner: req.body.hero_winner._id,
                    hero_loser: req.body.hero_loser._id,
                    user_winner: req.body.user_winner,
                    user_loser: req.body.user_loser,
                    format: req.body.format._id,
                    meta: req.body.meta._id,
                    created_by: req.user,
                    notes: req.body.notes
                });
            match.save((err) => {
                if (err) { return next(err) }
                return res.status(200).json({message: 'Match created!'})
            });
        }
    }
]

/**
 * Edit an existing Match.
 * In middleware chain after isMatchCreator to ensure that only authorized users can call this function.
 * We use res.locals to pass information between functions in the middleware chain.
 */
exports.edit_match = [
    body('date', 'Invalid date of birth.').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('round', 'Round must not be empty.').isString(),
    body('hero_winner', 'Hero (winner) must not be empty.').isObject(),
    body('hero_loser', 'Hero (loser) must not be empty.').isObject(),
    body('format', 'Format must not be empty.').isObject(),
    body('meta', 'Meta must not be empty.').isObject(),
    (req, res, next) => {
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            // Validation successful, edit the Match.
            const match = res.locals.match;
            match.date = req.body.date;
            match.event = req.body.event;
            match.round = req.body.round;
            match.hero_winner = req.body.hero_winner._id;
            match.hero_loser = req.body.hero_loser._id;
            match.user_winner = req.body.user_winner;
            match.user_loser = req.body.user_loser;
            match.format = req.body.format._id;
            match.meta = req.body.meta._id;
            match.notes = req.body.notes;
            match.save(function (err) {
                if (err) { return next(err); }
                res.status(200).json({message: 'Match updated!'});
            });
        }
    }
]

/**
 * Delete an existing Match.
 * In middleware chain after isMatchCreator to ensure that only authorized users can call this function.
 * We use res.locals to pass information between functions in the middleware chain.
 */
exports.delete_match = function (req, res, next) {
    Match.findByIdAndRemove(req.body._id).exec((err) => {
        if (err) {return next(err)}
        return res.status(200).json({message: "Match deleted!"});
    });
}