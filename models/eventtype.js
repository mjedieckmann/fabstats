const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventTypeSchema = new Schema(
    {
        descriptor: {type: String, required: true, maxLength: 100, unique: true},
    }
);

// Virtual for author's URL
EventTypeSchema
    .virtual('url')
    .get(function () {
        return '/api/event_type/' + this._id;
    });

//Export model
module.exports = mongoose.model('EventType', EventTypeSchema);
