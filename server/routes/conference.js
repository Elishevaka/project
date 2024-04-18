const Client = require('../models/client.js')
const RoomStatus = require('../models/statusRoom.js')
const Room = require('../models/room.js')
const Building = require('../models/building.js')

function isValidURL(str) {//function to check url
    try {
        const url = new URL(str);// Create a new URL object
        const searchParams = url.searchParams; // Use the searchParams property to check if the URL has any query parameters
        return true;// If no exception is thrown, the URL is valid
    } catch (error) {
        return false; // If an exception is thrown, the URL is not valid
    }
}

module.exports = {

    LoginScript: function (req, res) {
        const { username, password } = req.body;

        // Your authentication logic here
        // Example: Check if username and password match a user in the database
        if (username === 'exampleUser' && password === 'examplePassword') {
            // Authentication successful
            res.status(200).json({ message: 'Login successful' });
        } else {
            // Authentication failed
            res.status(401).json({ message: 'Invalid username or password' });
        }
    },
    // CREATE
    CreateClient: function (req, res) {
        if (!req.body)
            return res.status(400).send("No body");
        else if (!req.body.clientId || !req.body.name || !req.body.phoneNumber)
            return res.status(400).send("Missing parameters");

        // Create a new client data object
        const newClient = new Client({
            clientId: req.body.clientId,
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        });

        newClient.save()
            .then(savedClient => {
                // Check if a client with the same clientId already exists
                Client.findOne({ clientId: savedClient.clientId })
                    .then(existingClient => {
                        res.status(201).send(savedClient);
                    })
                    .catch(err => {
                        console.error('Error checking existing client:', err);
                        res.status(500).send('Internal Server Error');
                    });
            })
            .catch(err => {
                console.error('Error creating client:', err);
                res.status(500).send('Internal Server Error');
            });
    },

    CheckRoomStatus: function (req, res) {
        console.log("1");
        const roomId = req.params.roomId;
        RoomStatus.findOne({ roomId: roomId }, function (err, roomId) {
            console.log("roomId", req.params.roomId);
            console.log("room.status", roomId.status);
            if (err) {
                console.error('Error checking room status:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (!roomId) {
                return res.status(404).send('Room not found');
            }
            res.json({ status: roomId.status }); // Return room status
        });
    },

    SaveBuildingOnLoad: function (req, res) {
        if (!req.body) res.status(400).send("no body");
        else if (!req.body.buildingName || !req.body.buildingId) res.status(400).send("Missing parameters")
        else {
            const new_building = {
                "buildingName": req.body.buildingName,
                "buildingId": req.body.buildingId,
            };
            const building = new Building(new_building);
            building.save().then(building =>
                res.status(201).send(building)
            ).catch(e => {
                res.status(400).send(e)
            })
        }
    },

    CreateOrUpdateRoom: function (req, res) {
        const { roomId, buildingId } = req.body;
        console.log("roomId", roomId);
        console.log("buildingId", buildingId);
        // Check if a room with the same ID already exists
        RoomStatus.findOne({ roomId: roomId, buildingId: buildingId })
            .then(existingRoom => {
                if (existingRoom) {
                    // Room already exists, update its information if needed
                    console.log('Room already exists:', existingRoom);
                    // Perform any necessary updates here
                    res.status(200).send(existingRoom); // Sending existing room details
                } else {
                    // Room doesn't exist, create a new one
                    const newRoomStatus = new RoomStatus({
                        roomId: roomId,
                        buildingId: buildingId,
                        status: 'free'
                    });

                    // Save the new room status to MongoDB
                    newRoomStatus.save()
                        .then(newRoom => {
                            console.log('New room created:', newRoom);
                            res.status(201).send(newRoom); // Sending newly created room details
                        })
                        .catch(err => {
                            console.error('Error creating new room:', err);
                            res.status(500).send('Internal Server Error');
                        });
                }
            })
            .catch(err => {
                console.error('Error finding room:', err);
                res.status(500).send('Internal Server Error');
            });
    },

    FindBuildingId: async function (req, res) {
        console.log("lala");
        try {
            const { buildingName } = req.body;
            const building = await Building.findOne({ buildingName: buildingName }).exec();
            console.log("buildingName", buildingName);
            console.log("building", building);
            if (building) {
                res.json({ buildingId: building.buildingId });
            } else {
                res.status(404).json({ error: 'Building not found' });
            }
        } catch (error) {
            console.error('Error finding building:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    SaveBuildingData: async function (req, res) {
        console.log("SaveBuildingData");
        const { buildingName } = req.body;
        console.log("buildingName", buildingName);
        try {
            // Create a new instance of the Building model
            const newBuilding = new Building({
                buildingName: buildingName
            });

            // Save the new building to MongoDB
            const savedBuilding = await newBuilding.save();

            // Send back a response indicating success
            res.status(200).send('Building data saved to MongoDB');
        } catch (error) {
            console.error('Error saving building data to MongoDB:', error);
            res.status(500).send('Error saving building data to MongoDB');
        }
    },
    SaveBuildingInfo: async function (req, res) {
        try {
            const { buildingName } = req.body;
            console.log(buildingName + " buildingName!!");
            // Check if the building already exists
            const existingBuilding = await Building.findOne({ buildingName });

            if (existingBuilding) {
                console.log('Building already exists:', existingBuilding);
                return res.status(200).json({ message: 'Building already exists' });
            }

            // If building doesn't exist, create and save it
            const building = new Building({ buildingName });
            await building.save();

            console.log('Building data saved:', building);
            return res.status(201).json({ message: 'Building data saved successfully' });
        } catch (error) {
            console.error('Error saving building data:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
};