/**
 * Defines a database model.
 * This model represents the meta that a game is played in.
 * We define a meta change to be either:
 *  1. the introduction of new cards (e.g. set releases)
 *  2. changes in legality of existing cards (e.g. bans, suspensions, unbans etc.)
 * The data for this model is maintained by the administrator.
 */

const mongoose = require('mongoose');
const {DateTime} = require("luxon");

const Schema = mongoose.Schema;

const MetaSchema = new Schema(
    {
        descriptor: {type: String, required: true, maxLength: 100, unique: true},
        date: {type: Date, required: true},
        type: {type: String, enum: ['B \& S announcement', 'Set release', 'Other product release'], default: 'Set release'},
        changes: {type: String}
    },
    {
        toJSON: { virtuals: true }
    }
);

MetaSchema
    .virtual('url')
    .get(function () {
        return '/api/meta/' + this._id;
    });

MetaSchema
    .virtual('date_formatted')
    .get(function () {
        return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
    });

module.exports = mongoose.model('Meta', MetaSchema);
