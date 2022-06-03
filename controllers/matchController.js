const Match = require("../models/match");
const {body} = require("express-validator");
const {getValidationResult} = require("../utils/_helpers");

function sortMatches(a, b) {
    if (a.date < b.date) {return -1;}
    if (a.date > b.date) {return 1;}

    if (a.hero_winner.descriptor < b.hero_winner.descriptor) {return -1;}
    if (a.hero_winner.descriptor > b.hero_winner.descriptor) {return 1;}

    if (a.round < b.round) {return -1;}
    if (a.round > b.round) {return 1;}

    return 0;
}

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

// Display list of all Heroes.
exports.list_matches = function(req, res, next) {
    Match.find()
        .sort([['event']])
        .populate({ path: 'hero_winner', select: 'name img -_id' })
        .populate({ path: 'hero_loser', select: 'name img -_id' })
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
        .populate({ path: 'meta', select: 'descriptor -_id' })
        .populate({ path: 'format', select: 'descriptor -_id' })
        .exec(function (err, list_matches) {
            if (err) { return next(err); }
            // res.json(list_matches.sort(sortMatches));
            res.status(200).json(list_matches);
        });
};

exports.get_match = function (req, res, next){
    Match.findById(req.params.id)
        .populate({ path: 'hero_winner', select: 'name' })
        .populate({ path: 'hero_loser', select: 'name' })
        .populate({ path: 'user_winner', select: 'nick' } )
        .populate({ path: 'user_loser', select: 'nick' } )
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
        .populate({ path: 'format', select: 'descriptor' })
        .exec((err, match) => {
        if (err) { return next(err); }
        res.status(200).json(match);
    })
}

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
            let match = new Match(
                {
                    date: req.body.date,
                    event: req.body.event,
                    round: req.body.round,
                    hero_winner: req.body.hero_winner.id,
                    hero_loser: req.body.hero_loser.id,
                    user_winner: req.body.user_winner,
                    user_loser: req.body.user_loser,
                    format: req.body.format.id,
                    meta: req.body.meta.id,
                    created_by: req.user,
                });
            match.save((err) => {
                if (err) { return next(err) }
                return res.status(200).json({message: 'Match created!'})
            });
        }
    }
]

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
            const match = res.locals.match;
            match.date = req.body.date;
            match.event= req.body.event;
            match.round= req.body.round;
            match.hero_winner= req.body.hero_winner.id;
            match.hero_loser= req.body.hero_loser.id;
            match.user_winner= req.body.user_winner;
            match.user_loser= req.body.user_loser;
            match.format= req.body.format.id;
            match.meta= req.body.meta.id;
            match.save(function (err) {
                if (err) { return next(err); }
                res.status(200).json({message: 'Match updated!'});
            });
        }
    }
]

exports.delete_match = function (req, res, next) {
    Match.findByIdAndRemove(req.body._id).exec((err) => {
        if (err) {return next(err)}
        return res.status(200).json({message: "Match deleted!"});
    });
}