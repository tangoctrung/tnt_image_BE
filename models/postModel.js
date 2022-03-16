const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({

    body: {
        type: String,
        default: '',
    },
    likes: [
        {ref: 'user', type: String}     
    ],
    images: {
        type: String,
        default: '',
    },
    totalReport: {
        type: Number,
        default: 0,
    },
    authorId: {
        type: String,
        ref: 'user',
        required: true,
    },
    themen: {
        type: Array,
        default: '',
    }

}, {timestamps: true})

module.exports = mongoose.model("post", PostSchema); 