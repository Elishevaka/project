const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ClientSchema = new Schema({
    clientId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true, // Ensure email is unique
        lowercase: true, // Convert email to lowercase before saving
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // Validate email format
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    }
}, { timestamps: true }
);


const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;