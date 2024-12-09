const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OrderSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId, // Specify the type as ObjectId
        auto: true // Let MongoDB generate the unique ID automatically
    },
    clientId: {
        type: Number,
        required: true,
        unique: true
    },
    // roomId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'roomSchema', // Reference to the Room model
    //     required: true
    // },
    roomIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'roomSchema', // Reference to the Room model
            required: true,
        },
    ],
    // guestsNum: {
    //     type: Number,
    //     required: true
    // },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }, 
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true }
);

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;