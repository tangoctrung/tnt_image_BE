const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    senderNotiId: {
        type: String,
        ref: 'user',
    },
    receiverNotiId: [ 
        {type: String, ref: 'user',}
    ],
    typeNoti: {
        type: String,
        default: "",
    },
    content: {
        type: String,
        default: "",
    },
    postNotiId: {
        type: String,
        ref: 'post',
    },
    readNotiId: [
        {type: String, ref: 'user',}
    ],
    deleteNotiId: [
        {type: String, ref: 'user',}
    ]
}, {timestamps: true});

module.exports = mongoose.model("notification", NotificationSchema); 