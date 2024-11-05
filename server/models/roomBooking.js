const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const RoomSchema = new Schema({
//     roomId: {
//         type: Number,
//         required: true
//     },
//     buildingId: {
//         type: Number,
//         required: true
//     }
// });

// var RoomStatusSchema = new Schema({
//     rooms: [RoomSchema],
//     startDate: {
//         type: Date,
//         required: true
//     },
//     nightNumbers: {
//         type: Number,
//         required: true
//     },
//     status: {
//         type: String,
//         required: true,
//         trim: true,
//         default: "free"
//     }

// }, { timestamps: true }
// );

// const RoomStatus = mongoose.model('RoomStatus', RoomStatusSchema);


const RoomBookingSchema = new Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roomSchema', // Reference to the Room model
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
    status: {
        type: String,
        enum: ['booked', 'free'],
        default: 'booked'
    }
}, { timestamps: true });

// Create an index on roomId, startDate, and endDate for optimized querying
RoomBookingSchema.index({ roomId: 1, startDate: 1, endDate: 1 });

const RoomBooking = mongoose.model('RoomBooking', RoomBookingSchema);

module.exports = RoomBooking