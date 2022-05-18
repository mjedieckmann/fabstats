const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    image: { data: Buffer, contentType: String },
}, { timestamps: true });

module.exports = mongoose.model('images', imageSchema);