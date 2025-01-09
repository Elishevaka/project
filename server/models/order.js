const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OrderSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true 
    },
    clientId: {
        type: Number,
        required: true,
    },
    roomIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'roomSchema', // Reference to the Room model
            required: true,
        },
    ],
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
    },
    paymentBy: {
        type: String,
        enum: ['No payment', 'Credit', 'Check', 'Cash'], // Enumerated options
        default: 'No payment' // Default value
    },
    tableIds: 
    [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiningTable',
        default: null
    }],
    tablePreferences: {
        nearWindow: { type: Boolean, default: false },
        nearDoor: { type: Boolean, default: false },
        diningRoom: {
            type: Number,
            enum: [1, 2],
            default: null
        }
    }
}, { timestamps: true }
);

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;