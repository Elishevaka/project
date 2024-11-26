const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const id_validator = require('mongoose-id-validator');

var BuildingSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId, // Specify the type as ObjectId
        auto: true // Let MongoDB generate the unique ID automatically
    },
    buildingName: {
        type: String,
        required: true,
        trim: true
    },
    numberOfRooms: {
        type: Number,
        required: true,
        trim: true
    }
}
);

//BuildingSchema.plugin(id_validator);//This plugin is used to validate ObjectIds.

const Building = mongoose.model('BuildingSchema', BuildingSchema);
module.exports = Building

