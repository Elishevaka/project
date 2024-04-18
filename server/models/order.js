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

var OrderSchema = new Schema({
    orderId: {
        type: Number,
        required: true,
        unique: true
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
    nightNumbers: {
        type: Number,
        required: true
    },
    isFree: {// need to pay or get free
        type: Boolean,
        required: true
    },
    rooms: [RoomSchema]
}, { timestamps: true }
);

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;