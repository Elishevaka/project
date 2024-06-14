const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roomSchema', // Reference to the Room model
        required: true
    },
    buildingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BuildingSchema', // Reference to the Building model
        required: true
    }
});

var OrderSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId, // Specify the type as ObjectId
        auto: true // Let MongoDB generate the unique ID automatically
    },
    clientId: {
        type: Number,
        required: true
    },
    guestsNum: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    nightNumbers: {
        type: Number,
        required: true
    },
    isFree: {// need to pay or get free
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    rooms: [RoomSchema]
}, { timestamps: true }
);

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;