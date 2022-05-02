const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        nick: {type: String, required: true, maxLength: 100, unique: true},
        e_mail: {type: String, required: true, maxLength: 100, unique: true},
        team: {type: Schema.Types.ObjectId, ref: 'Team'},
    }
);

// Virtual for user's URL
UserSchema
    .virtual('url')
    .get(function () {
        return '/users/' + this._id;
    });

//Export model
module.exports = mongoose.model('User', UserSchema);
