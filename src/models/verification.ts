import mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    tokenExpiration: {
        type: Number,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    netid: {
        type: String,
        required: true,
    },
});

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;