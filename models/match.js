const mongoose = require('mongoose');
const {DateTime} = require("luxon");

const Schema = mongoose.Schema;

const MatchSchema = new Schema(
    {
        hero_a: {type: Schema.Types.ObjectId, ref: 'Hero', required: true},
        hero_b: {type: Schema.Types.ObjectId, ref: 'Hero', required: true},
        winner: {type: Number, required: true, enum: [0, 1], default: 0},
        date: {type: Date, default: Date.now},
        user_a: {type: Schema.Types.ObjectId, ref: 'User'},
        user_b: {type: Schema.Types.ObjectId, ref: 'User'},
        event_type: {type: Schema.Types.ObjectId, ref: 'EventType'},
        top_cut: {type: String, enum: ['Swiss', 'Quarterfinal', 'Semifinal', 'Final', 'N/A']},
        notes: {type: String},
        format: {type: Schema.Types.ObjectId, ref: 'Format'},
    }
);

// Virtual for book's URL
MatchSchema
    .virtual('url')
    .get(function () {
        return '/api/match/' + this._id;
    });

MatchSchema
    .virtual('date_formatted')
    .get(() => {
        return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
    });

//Export model
module.exports = mongoose.model('Match', MatchSchema);
