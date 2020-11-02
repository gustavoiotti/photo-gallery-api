const mongoose = require('mongoose');
const PhotoSchema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String,
    url: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;