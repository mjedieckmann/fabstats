const {body} = require("express-validator");
const Team = require("../models/team");
const {getValidationResult} = require("../utils/_helpers");


exports.current_team = function (req, res, next) {
    if (!req.isAuthenticated()) { return next(); }
    Team.findById(req.user.team).exec((err, team) =>{
        if (err) { next(err) }
        res.locals.team = team;
        next();
    });
}

exports.list_teams = function(req, res, next) {
    Team.find()
        .sort([['nick']])
        .exec(function (err, list_teams) {
            if (err) { return next(err); }
            res.json(list_teams);
        });
};

exports.create_team = [
    body('nick', 'Team name must not be empty.').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            Team.findOne({ nick: req.body.descriptor}).exec((err, team) => {
                if (err) {return next(err)}
                if (team) {
                    return res.status(403).json({message: 'A Team with that name already exists!'})
                } else {
                    const newTeam = new Team({
                        nick: req.body.nick,
                        created_by: req.user
                    });
                    newTeam.save((err) => {
                        if (err) { return next(err)}
                        return res.status(200).json({message: 'Team "' + newTeam.nick + '" created!', team: newTeam });
                    })
                }
            })
        }
    }
]

exports.edit_team = [
    // Validate and sanitize fields.
    body('nick', 'Team name must not be empty.').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            Team.findById(req.body._id).exec((err, team) => {
                if (err) { return next(err); }
                team.nick = req.body.nick;
                team.save(function (err, team) {
                    if (err) { return next(err); }
                    return res.status(200).json({message: 'Team updated!', team: team});
                });
            })
        }
    }
]

exports.delete_team = function (req, res, next) {
    Team.findByIdAndRemove(req.body._id).exec((err) => {
        if (err) {return next(err)}
        return res.status(200).json({message: "Team deleted!"});
    });
}