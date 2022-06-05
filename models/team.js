/**
 * Defines a database model.
 * This model represents the teams that users can form and be part of.
 * The data for this model comes from the users.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema(
    {
        nick: {type: String, required: true, maxLength: 100, unique:true},
        created_by: {type: Schema.Types.ObjectId, ref: 'User'},
    }
);

TeamSchema
    .virtual('url')
    .get(function () {
        return '/users/teams' + this._id;
    });

module.exports = mongoose.model('Team', TeamSchema);
