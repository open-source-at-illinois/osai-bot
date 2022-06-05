import mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    netid: {
        type: String,
        required: false,
        unique: true,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    discordId: {
        type: String,
        unique: true,
        required: true,
    },
    github: {
        type: String,
        unique: true,
        required: false,
    }
});

const User = mongoose.model('User', userSchema);

export default User;