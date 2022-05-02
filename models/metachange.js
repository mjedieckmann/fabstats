const mongoose = require('mongoose');
const {DateTime} = require("luxon");

const Schema = mongoose.Schema;

const MetaChangeSchema = new Schema(
    {
        descriptor: {type: String, required: true, maxLength: 100, unique: true},
        date: {type: Date, required: true},
        type: {type: String, enum: ['B \& S Announcement', 'Set Release'], default: 'Set Release'},
    }
);

// Virtual for author's URL
MetaChangeSchema
    .virtual('url')
    .get(function () {
        return '/api/meta_change/' + this._id;
    });

MetaChangeSchema
    .virtual('date_formatted')
    .get(() => {
        return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
    });

//Export model
module.exports = mongoose.model('MetaChange', MetaChangeSchema);
