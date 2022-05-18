const Match = require("../models/match");

function sortMatches(a, b) {
    if (a.event.date < b.event.date) {return -1;}
    if (a.event.date > b.event.date) {return 1;}

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
                    path: 'meta',
                    model: 'Meta'
                },
                {
                    path: 'to',
                    model: 'TO',
                }
            ]
        })
        .populate({ path: 'format', select: 'descriptor -_id' })
        .exec(function (err, list_matches) {
            if (err) { return next(err); }
            res.json(list_matches.sort(sortMatches));
        });
};