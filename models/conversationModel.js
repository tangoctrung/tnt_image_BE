const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members1: {
        type: String,
        ref: 'user',
    },
    members2: {
        type: String,
        ref: 'user',
    },
    messageLast: {
        type: String,
        default: '',
    },
    senderId: {
        type: String,
        default: '',
    },
    memberRead: {  // thành viên đã đọc tin nhắn cuối
        type: Array,
        default: [],
    }

}, {timestamps: true})

module.exports = mongoose.model("conversation", ConversationSchema); 