const mongoose = require('mongoose')

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
        required: true,
    },
    github: {
        type: String,
        required: false,
    },
    token: {
        type: String,
        required: false,
    },
    tokenExpiration: {
        type: Date,
        required: false,
    }
});

const User = mongoose.model('User', userSchema);

export default User;