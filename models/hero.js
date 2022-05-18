const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HeroSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 100, unique: true},
        formats: [{type: Schema.Types.ObjectId, ref: 'Format', required: true}],
        img: {type: String, required: true, maxLength: 100, unique: true}
    }
);

// Virtual for author's URL
HeroSchema
    .virtual('url')
    .get(function () {
        return '/api/hero/' + this._id;
    });

//Export model
module.exports = mongoose.model('Hero', HeroSchema);
