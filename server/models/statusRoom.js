const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    roomId: {
        type: Number,
        required: true
    },
    buildingId: {
        type: Number,
        required: true
    }
});

var RoomStatusSchema = new Schema({
    rooms: [RoomSchema],
    startDate: {
        type: Date,
        required: true
    },
    nightNumbers: {
        type: Number,
        required: true
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