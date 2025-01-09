const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TableReservationSchema = new Schema({
    clientId: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true 
    },
    diningTableId: 
    { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiningTable',
        required: true 
    },
    date:
    {
        type: Date,
        required: true
    },    
    status: {
        type: String,
        enum: ['free', 'occupied'],
        default: 'free'
    },
    notes: 
    {
        type: String
    } // Optional for additional preferences
});

module.exports = mongoose.model('TableReservation', TableReservationSchema);
