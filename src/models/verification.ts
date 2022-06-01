const mongoose = require('mongoose')

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
        type: Date,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    netid: {
        type: String,
        required: false,
    },
});

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;