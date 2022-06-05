/**
 * Defines a database model.
 * This model represents the tournament organizers (TO) that organize sanctioned events.
 * The data for this model comes from the users.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TOSchema = new Schema(
    {
        descriptor: {type: String, required: true, maxLength: 100, unique: true},
        created_by: {type: Schema.Types.ObjectId, ref: 'User'},
    }
);

TOSchema
    .virtual('url')
    .get(function () {
        return '/api/to/' + this._id;
    });

module.exports = mongoose.model('TO', TOSchema);