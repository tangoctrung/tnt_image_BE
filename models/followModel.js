const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = new Schema({

    follower: {  // người theo dõi
        ref: 'user',
        type: String,
        default: '',
    },
    isfollower: {  // người được theo dõi
        ref: 'user',
        type: String,
        default: '',
    }

}, {timestamps: true})

module.exports = mongoose.model("follow", FollowSchema);