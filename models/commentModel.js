const mongoose = require('mongoose');

const CommentsSchema = new  mongoose.Schema({
    writerId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        // type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        default: '',
    },
    likes: {
        type: Array,
        default: [],
    },
    totalReport: {
        type: Array,
        default: [],
    },
    isDelete: {
        type: Boolean,
        default: false,
    }

}, {timestamps: true})

module.exports = mongoose.model("comment",CommentsSchema);