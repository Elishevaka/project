const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var RoomSchema = new Schema({
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId, // Specify the type as ObjectId
    //     auto: true // Let MongoDB generate the unique ID automatically
    // },
    roomNumber: {
        type: Number,
        required: true
    },
    buildingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BuildingSchema', // Reference to the Building model
        required: true
    },
    buildingName: {
        type: String,
        required: true
    },
    numOfRooms: {
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
});

const Room = mongoose.model('roomSchema', RoomSchema);

module.exports = Room