/**
 * Defines a database model.
 * This model represents the different heroes that can be played.
 * The data for this model is maintained by the administrator.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HeroSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 100, unique: true},
        formats: [{type: Schema.Types.ObjectId, ref: 'Format', required: true}],
        img: {type: String, required: true, maxLength: 100, unique: true}
    }
);

HeroSchema
    .virtual('url')
    .get(function () {
        return '/api/hero/' + this._id;
    });

module.exports = mongoose.model('Hero', HeroSchema);
