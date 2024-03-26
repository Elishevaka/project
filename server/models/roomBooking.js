const mongoose = require('mongoose');
// const id_validator = require('mongoose-id-validator');

var RoomStatusSchema = new mongoose.Schema({
    number_of_room: {
        type: Number,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true,
        default: "free"
    }

}, { timestamps: true }
);

const RoomStatus = mongoose.model('RoomStatus', RoomStatusSchema);

module.exports = RoomStatus