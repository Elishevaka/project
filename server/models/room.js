const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var RoomSchema = new Schema({
    roomId: {
        type: Number,
        required: true
    },
    buildingId: {
        type: Number,
        required: true
    },
    numRooms: {
        type: Number,
        required: true
    },
    numBeds: {
        type: Number,
        required: true
    },
    floor: {
        type: Number,
        required: true
    }
}
);

const Room = mongoose.model('roomSchema', RoomSchema);

module.exports = Room

//nestJs