const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    when: {
        type: String,
        required: false,
    },
    where: {
        type: String,
        required: false,
    },
    points: {
        type: Number,
        required: true,
        default: 1,
    }
})
