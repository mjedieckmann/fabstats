/**
 * Controller for the Team model.
 * Handles interactions with the database.
 * Related:
 *  ../routes/api.js
 */

const {body} = require("express-validator");
const Team = require("../models/team");
const {getValidationResult} = require("../utils/_helpers");

/**
 * Sets res.locals to the team the current authentication belongs to (if any).
 */
exports.current_team = function (req, res, next) {
    if (!req.isAuthenticated()) { return next(); }
    Team.findById(req.user.team).exec((err, team) =>{
        if (err) { next(err) }
        res.locals.team = team;
        next();
    });
}

/**
 * Check if the current authentication is the creator of the Team they are trying to manipulate.
 */
exports.isTeamCreator = function(req, res, next) {
    Team.findOne({
        _id: req.body._id,
        created_by: req.user._id
    }).exec((err, team) => {
        if (err !== null) { return next(err)}
        if (team === null){
            return res.status(401).json({message: "You are not the creator of this Team!"});
        } else {
            res.locals.team = team;
            return next();
        }
    });
}

/**
 * Returns a list of all Teams.
 */
exports.list_teams = function(req, res, next) {
    Team.find()
        .sort('nick')
        .exec(function (err, list_teams) {
            if (err) { return next(err); }
            res.json(list_teams);
        });
};

/**
 * Create a new Team.
 * Sets the current authentication as the creator of the Team.
 */
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
                    // Validation successful, create and save the new Team.
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

/**
 * Edit an existing Team.
 * In middleware chain after isTeamCreator to ensure that only authorized users can call this function.
 * We use res.locals to pass information between functions in the middleware chain.
 */
exports.edit_team = [
    body('nick', 'Team name must not be empty.').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const validation = getValidationResult(req);
        if (validation.hasErrors) {
            return res.status(409).json({message: validation.message});
        } else {
            // Validation successful, edit the Team.
            const team = res.locals.team;
            team.nick = req.body.nick;
            team.save(function (err, team) {
                if (err) { return next(err); }
                return res.status(200).json({message: 'Team updated!', team: team});
            });
        }
    }
]

/**
 * Delete an existing Team.
 * In middleware chain after isTeamCreator to ensure that only authorized users can call this function.
 * We use res.locals to pass information between functions in the middleware chain.
 */
exports.delete_team = function (req, res, next) {
    Team.findByIdAndRemove(req.locals.team._id).exec((err) => {
        if (err) {return next(err)}
        return res.status(200).json({message: "Team deleted!"});
    });
}