const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var DiningTableSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    tableNumber: {
        type: String,
        required: true,
        unique: true
    },
    numberOfSeats: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 6
    },
    nearWindow: {
        type: Boolean,
        required: true
    },
    nearDoor: {
        type: Boolean,
        required: true
    },
    diningRoom: {
        type: Number,
        required: true,
        enum: [1, 2]
    }
}, { timestamps: true });

const DiningTable = mongoose.model('DiningTable', DiningTableSchema);

module.exports = DiningTable;
