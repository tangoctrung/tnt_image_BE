const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({

    body: {
        type: String,
        default: '',
    },
    score: {
        type: Number,
        default: 0,
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

PostSchema.index({body: 'text', themen: 'text'});

module.exports = mongoose.model("post", PostSchema); 