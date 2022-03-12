const mongoose = require('mongoose');

const FileConversationSchema = new mongoose.Schema({
    typeFile: {
        type: String,
        default: '',
    },
    urlFile: {
        type: String,
        default: '',
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    conversationId: {
        ref: 'conversation',
        type: String,
        default: '',
    },
    senderId: {
        type: String,
        default: '',
    }

}, {timestamps: true})

module.exports = mongoose.model("fileConversation", FileConversationSchema); 