const mongoose = require('mongoose');
const {DateTime} = require("luxon");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
    {
        descriptor: {type: String, maxLength: 100, required: true, unique: true},
        to: {type: Schema.Types.ObjectId, ref: 'TO', default: null},
        event_type: {type: String, required: true, enum: [
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
            ]},
        created_by: {type: Schema.Types.ObjectId, ref: 'User'},
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

//Export model
module.exports = mongoose.model('Event', EventSchema);
