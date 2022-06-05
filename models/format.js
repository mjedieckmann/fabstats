/**
 * Defines a database model.
 * This model represents the different official formats that can be played.
 * The data for this model is maintained by the administrator.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormatSchema = new Schema(
    {
        descriptor: {type: String, required: true, maxLength: 100, unique: true},
        type: {type: String, enum: ['Constructed', 'Limited'], default: 'Constructed', required: true}
    },
);

module.exports = mongoose.model('Format', FormatSchema);
