const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormatSchema = new Schema(
    {
        descriptor: {type: String, required: true, maxLength: 100, unique: true},
        type: {type: String, enum: ['Constructed', 'Limited'], default: 'Constructed', required: true}
    },
    {
        toJSON: { virtuals: true }
    }
);

// Virtual for author's URL
FormatSchema
    .virtual('url')
    .get(function () {
        return '/api/format/' + this._id;
    });

//Export model
module.exports = mongoose.model('Format', FormatSchema);
