const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members: {
        type: Array,
        default: [],
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