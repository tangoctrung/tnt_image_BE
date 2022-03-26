const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
        default: "",
    },
    date: {
        type: String,
        required: false,
        default: "",
    },
    job: {
        type: String,
        required: false,
        default: "",
    },
    address: {
        type: String,
        required: false,
        default: "",
    },
    postSaved: {
        type: Array,
        default: [],
    }

}, {timestamps: true});

module.exports = mongoose.model("user", UserSchema);