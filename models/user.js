/**
 * Defines a database model.
 * This model represents the users of our application.
 * The data for this model comes from the users.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        nick: {type: String, required: true, minLength: 4, maxLength: 20, unique: true},
        hash: {type: String, required: true},
        salt: {type: String, required: true},
        e_mail: {type: String, required: true, maxLength: 100, unique: true},
        team: {type: Schema.Types.ObjectId, ref: 'Team', default: null},
        img: {type: String},
        token: {type: String},
    }
);

UserSchema
    .virtual('url')
    .get(function () {
        return '/users/' + this._id;
    });

module.exports = mongoose.model('User', UserSchema);
