const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema(
    {
        nick: {type: String, required: true, maxLength: 100},
    }
);

// Virtual for user's URL
TeamSchema
    .virtual('url')
    .get(function () {
        return '/users/teams' + this._id;
    });

//Export model
module.exports = mongoose.model('Team', TeamSchema);
