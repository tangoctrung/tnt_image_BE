const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
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