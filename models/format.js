const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormatSchema = new Schema(
    {
        descriptor: {type: String, required: true, maxLength: 100, unique: true},
        type: {type: String, enum: ['Constructed', 'Limited'], default: 'Constructed', required: true}
    },
);

//Export model
module.exports = mongoose.model('Format', FormatSchema);
