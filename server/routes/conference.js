const ClientData = require('../models/roomDetails.js')
const RoomStatus = require('../models/roomBooking.js')

module.exports = {
    // CREATE
    CreateClient: function (req, res) {
        if (!req.body)
            return res.status(400).send("No body");
        else if (!req.body.name || !req.body.email)
            return res.status(400).send("Missing parameters");
        // Create a new client data object
        const newClient = new ClientData({
            name: req.body.name,
            email: req.body.email
        });
        // Save the client data to MongoDB
        newClient.save()
            .then(clientData => res.status(201).send(clientData))
            .catch(err => res.status(400).send(err.message));
    },

    CreateRoom: function (req, res) {
        if (!req.body)
            return res.status(400).send("No body");
        else if (!req.body.number_of_room)
            return res.status(400).send("Missing parameters");

        // Create a new room status object
        const newRoomStatus = new RoomStatus({
            number_of_room: req.body.number_of_room,
            status: req.body.status || "free" // Default status is "free" if not provided
        });

        // Save the room status to MongoDB
        newRoomStatus.save()
            .then(roomStatus => res.status(201).send(roomStatus))
            .catch(err => res.status(400).send(err.message));
    }
};