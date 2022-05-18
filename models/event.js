const mongoose = require('mongoose');
const {DateTime} = require("luxon");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
    {
        descriptor: {type: String, maxLength: 100, required: true},
        to: {type: Schema.Types.ObjectId, ref: 'TO'},
        type: {type: String, required: true, enum: [
                'Test Game',
                'On Demand',
                'Armory',
                'Skirmish',
                'Road to Nationals',
                'ProQuest',
                'Battle Hardened',
                'Calling',
                'Nationals',
                'Pro Tour',
                'Farewell Welcome to Rathe',
                'Pre-release',
                'World Championship',
                'N/A'
            ]},
        meta: {type: Schema.Types.ObjectId, required: true, ref: 'Meta'},
        date: {type: Date, default: Date.now, required: true},
    },
    {
        toJSON: { virtuals: true }
    }
);

// Virtual for author's URL
EventSchema
    .virtual('url')
    .get(function () {
        return '/api/event/' + this._id;
    });

EventSchema
    .virtual('date_formatted')
    .get(function () {
            return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
    });

//Export model
module.exports = mongoose.model('Event', EventSchema);
