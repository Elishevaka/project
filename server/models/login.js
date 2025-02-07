const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoginSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    emailToSendPassword: {
        type: String,
        trim: true,
        //unique: true, // Ensure email is unique
        lowercase: true, // Convert email to lowercase before saving
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // Validate email format
    }
});

const Login = mongoose.model('Login', LoginSchema);

module.exports = Login;
