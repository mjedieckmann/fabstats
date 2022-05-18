const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TOSchema = new Schema(
    {
        descriptor: {type: String, required: true, maxLength: 100},
    }
);

// Virtual for user's URL
TOSchema
    .virtual('url')
    .get(function () {
        return '/api/to/' + this._id;
    });

//Export model
module.exports = mongoose.model('TO', TOSchema);