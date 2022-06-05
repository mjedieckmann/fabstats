/**
 * Defines a database model.
 * This model is the backbone of the application and represents a match that was played between two players.
 * It contains the result of the match, the event that it was played in (if any), the date the match took place, the
 * format and meta, as well as notes taken by the creator of the match (optional).
 * The data for this model comes from the users.
 */

const mongoose = require('mongoose');
const {DateTime} = require("luxon");

const Schema = mongoose.Schema;

const MatchSchema = new Schema(
    {
        date: {type: Date, default: Date.now, required: true},
        event: {type: Schema.Types.ObjectId, ref: 'Event', default: null},
        round: {type: String, required: true, enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Quarterfinal', 'Semifinal', 'Final', 'N/A']},
        hero_winner: {type: Schema.Types.ObjectId, ref: 'Hero', required: true},
        hero_loser: {type: Schema.Types.ObjectId, ref: 'Hero', required: true},
        user_winner: {type: Schema.Types.ObjectId, ref: 'User'},
        user_loser: {type: Schema.Types.ObjectId, ref: 'User'},
        format: {type: Schema.Types.ObjectId, required: true, ref: 'Format'},
        meta: {type: Schema.Types.ObjectId, required: true, ref: 'Meta'},
        notes: {type: String},
        created_by: {type: Schema.Types.ObjectId, ref: 'User'},
    },
    {
        toJSON: { virtuals: true }
    }
);

MatchSchema
    .virtual('url')
    .get(function () {
        return '/api/match/' + this._id;
    });

MatchSchema
    .virtual('date_formatted')
    .get(function () {
        return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
    });

module.exports = mongoose.model('Match', MatchSchema);
