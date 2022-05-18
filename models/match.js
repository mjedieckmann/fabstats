const mongoose = require('mongoose');
const {DateTime} = require("luxon");

const Schema = mongoose.Schema;

const MatchSchema = new Schema(
    {
        event: {type: Schema.Types.ObjectId, ref: 'Event', required: true},
        round: {type: String, required: true, enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Quarterfinal', 'Semifinal', 'Final', 'N/A']},
        hero_winner: {type: Schema.Types.ObjectId, ref: 'Hero', required: true},
        hero_loser: {type: Schema.Types.ObjectId, ref: 'Hero', required: true},
        user_winner: {type: Schema.Types.ObjectId, ref: 'User'},
        user_loser: {type: Schema.Types.ObjectId, ref: 'User'},
        format: {type: Schema.Types.ObjectId, ref: 'Format'},
        notes: {type: String},
    },
    {
        toJSON: { virtuals: true }
    }
);

// Virtual for book's URL
MatchSchema
    .virtual('url')
    .get(function () {
        return '/api/match/' + this._id;
    });

//Export model
module.exports = mongoose.model('Match', MatchSchema);
