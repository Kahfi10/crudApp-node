const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone : {
        type: String,
        required: true,
    },
    Image: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

module.exports = mongoose.model('User', userSchema);