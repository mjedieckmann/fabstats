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

// Virtual for author's URL
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

//Export model
module.exports = mongoose.model('Meta', MetaSchema);
