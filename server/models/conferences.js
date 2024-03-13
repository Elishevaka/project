const mongoose = require('mongoose');

const Conference = mongoose.model('Conference', ConferenceSchema );

module.exports = Conference//This exports the `Conference` model so that it can be imported and used in other files.