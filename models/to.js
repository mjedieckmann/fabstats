const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TOSchema = new Schema(
    {
        descriptor: {type: String, required: true, maxLength: 100, unique: true},
        created_by: {type: Schema.Types.ObjectId, ref: 'User'},
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