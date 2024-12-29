const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ClientSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId, // Specify the type as ObjectId
        auto: true // Let MongoDB generate the unique ID automatically
    },
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
        //unique: true, // Ensure email is unique
        lowercase: true, // Convert email to lowercase before saving
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // Validate email format
    },
    phoneNumber: {
        type: String,
        required: true,
        //unique: true
    },
    city: {
        type: String,
        trim: true
    },
    zipCode: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    specialRequests: {
        type: String,
        trim: true
    }
}, { timestamps: true }
);

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;