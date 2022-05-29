const {body} = require("express-validator");
const Team = require("../models/team");

// Display list of all Teams.
exports.team_list = function(req, res, next) {
    Team.find()
        .sort([['nick']])
        .exec(function (err, list_teams) {
            if (err) { return next(err); }
            //Successful, so return
            res.json(list_teams);
        });
};

exports.current_team = function (req, res, next) {
    if (!req.isAuthenticated()) { return next(); }
    Team.findById(req.user.team).exec((err, team) =>{
       if (err) { next(err) }
       res.locals.team = team;
       next();
    });
}

exports.event_create_team = [
    body('team').trim().escape(),
    (req, res, next) => {
        if (req.body.team === null || req.body.team === ''){
            res.locals.team = null;
            return next();
        }
        Team.find({nick: req.body.team}).exec((err, team) => {
            if (team.length === 0) {
                const newTeam = new Team({nick: req.body.team});
                newTeam.save((err, newTeam) => {
                    if (err) { return next(err)}
                    res.locals.team = newTeam._id;
                    return next();
                })
            } else {
                res.locals.team = team[0]._id;
                return next();
            }
        })
    }
]