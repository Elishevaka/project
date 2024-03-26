const mongoose = require('mongoose');
const id_validator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var ClientDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true, // Ensure email is unique
        lowercase: true, // Convert email to lowercase before saving
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // Validate email format
    }
}, { timestamps: true }
);

ClientDataSchema.plugin(id_validator);//This plugin is used to validate ObjectIds.
ClientDataSchema.index("completed");


const ClientData = mongoose.model('ClientData', ClientDataSchema);

module.exports = ClientData;