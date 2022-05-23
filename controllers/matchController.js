const Match = require("../models/match");
const {body} = require("express-validator");
const Event = require("../models/event");
const Author = require("../models/author");

function sortMatches(a, b) {
    if (a.date < b.date) {return -1;}
    if (a.date > b.date) {return 1;}

    if (a.event.descriptor < b.event.descriptor) {return -1;}
    if (a.event.descriptor > b.event.descriptor) {return 1;}

    if (a.round < b.round) {return -1;}
    if (a.round > b.round) {return 1;}

    return 0;
}

// Display list of all Heroes.
exports.match_list = function(req, res, next) {
    Match.find()
        .sort([['event']])
        .populate({ path: 'hero_winner', select: 'name img -_id' })
        .populate({ path: 'hero_loser', select: 'name img -_id' })
        .populate({
            path: 'user_winner',
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
            res.json(list_matches);
        });
};

exports.match_detail = function (req, res, next){
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
        res.json(match);
    })
}

exports.event_edit_match = [
    body('date', 'Invalid date of birth.').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('event', 'Event must not be empty.').isObject(),
    body('round', 'Round must not be empty.').isString(),
    body('hero_winner', 'Hero (winner) must not be empty.').isObject(),
    body('hero_loser', 'Hero (loser) must not be empty.').isObject(),
    body('format', 'Format must not be empty.').isObject(),
    body('meta', 'Meta must not be empty.').isObject(),
    (req, res, next) => {
        Match.findById(req.body._id).then((match) => {
            match.date = req.body.date;
            match.event= req.body.event.id;
            match.round= req.body.round;
            match.hero_winner= req.body.hero_winner.id;
            match.hero_loser= req.body.hero_loser.id;
            match.user_winner= req.body.user_winner.id;
            match.user_loser= req.body.user_loser.id;
            match.format= req.body.format.id;
            match.meta= req.body.meta.id;
            match.save(function (err, match) {
                if (err) { return next(err); }
                Match.populate(match, [
                    { path: 'hero_winner', select: 'name img' },
                    { path: 'hero_loser', select: 'name img -_id' },
                    { path: 'user_winner', populate: [{ path: 'team', model: 'Team' }] },
                    { path: 'user_loser', populate: [{ path: 'team', model: 'Team' }] },
                    { path: 'event', populate: [{ path: 'to', model: 'TO'}] },
                    { path: 'meta', select: 'descriptor -_id' },
                    { path: 'format', select: 'descriptor -_id' }
                ]).then((populatedMatch) => res.json(populatedMatch));
            });
        });
    }
]

exports.event_create_match = [
    body('date', 'Invalid date of birth.').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('event', 'Event must not be empty.').isObject(),
    body('round', 'Round must not be empty.').isString(),
    body('hero_winner', 'Hero (winner) must not be empty.').isObject(),
    body('hero_loser', 'Hero (loser) must not be empty.').isObject(),
    body('format', 'Format must not be empty.').isObject(),
    body('meta', 'Meta must not be empty.').isObject(),
    (req, res, next) => {
        let match = new Match(
            {
                date: req.body.date,
                event: req.body.event.id,
                round: req.body.round,
                hero_winner: req.body.hero_winner.id,
                hero_loser: req.body.hero_loser.id,
                user_winner: req.body.user_winner.id,
                user_loser: req.body.user_loser.id,
                format: req.body.format.id,
                meta: req.body.meta.id,
            });
        match.save(function (err, match) {
            if (err) { return next(err); }
            Match.populate(match, [
                { path: 'hero_winner', select: 'name img' },
                { path: 'hero_loser', select: 'name img -_id' },
                { path: 'user_winner', populate: [{ path: 'team', model: 'Team' }] },
                { path: 'user_loser', populate: [{ path: 'team', model: 'Team' }] },
                { path: 'event', populate: [{ path: 'to', model: 'TO'}] },
                { path: 'meta', select: 'descriptor -_id' },
                { path: 'format', select: 'descriptor -_id' }
            ]).then((populatedMatch) => res.json(populatedMatch));
        });
    }
]