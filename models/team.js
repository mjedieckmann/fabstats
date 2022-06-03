const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema(
    {
        nick: {type: String, required: true, maxLength: 100, unique:true},
        created_by: {type: Schema.Types.ObjectId, ref: 'User'},
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
