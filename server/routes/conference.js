const Client = require('../models/client.js')
const RoomStatus = require('../models/statusRoom.js')
const Room = require('../models/room.js')
const Building = require('../models/building.js')
const Order = require('../models/order.js')

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
    // // CREATE
    // CreateClient: function (req, res) {
    //     if (!req.body)
    //         return res.status(400).send("No body");
    //     else if (!req.body.clientId || !req.body.name || !req.body.phoneNumber)
    //         return res.status(400).send("Missing parameters");

    //     // Create a new client data object
    //     const newClient = new Client({
    //         clientId: req.body.clientId,
    //         name: req.body.name,
    //         email: req.body.email,
    //         phoneNumber: req.body.phoneNumber
    //     });

    //     newClient.save()
    //         .then(savedClient => {
    //             // Check if a client with the same clientId already exists
    //             Client.findOne({ clientId: savedClient.clientId })
    //                 .then(existingClient => {
    //                     res.status(201).send(savedClient);
    //                 })
    //                 .catch(err => {
    //                     console.error('Error checking existing client:', err);
    //                     res.status(500).send('Internal Server Error');
    //                 });
    //         })
    //         .catch(err => {
    //             console.error('Error creating client:', err);
    //             res.status(500).send('Internal Server Error');
    //         });
    // },

    CheckRoomStatus: function (req, res) {
        const roomId = req.params.roomId;
        RoomStatus.findOne({ roomId: roomId }, function (err, roomId) {
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
        try {
            const { buildingName } = req.body;
            const building = await Building.findOne({ buildingName: buildingName }).exec();
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
    SaveBuildingInfo: async function (req, res) {
        try {
            const { buildingName, numberOfRooms } = req.body;
            // Check if the building already exists
            const existingBuilding = await Building.findOne({ buildingName });

            if (existingBuilding) {
                console.log('Building already exists:', existingBuilding);
                return res.status(200).json({ message: 'Building already exists' });
            }

            // If building doesn't exist, create and save it
            const building = new Building({ buildingName, numberOfRooms });
            await building.save();

            console.log('Building data saved:', building);
            return res.status(201).json({ message: 'Building data saved successfully' });
        } catch (error) {
            console.error('Error saving building data:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    },
    GetOrCreateRooms: async function (req, res) {
        try {
            const { buildingName } = req.body;
            const building = await Building.findOne({ buildingName });

            if (!building) {
                return res.status(404).json({ message: 'Building not found' });
            }

            let rooms = await Room.find({ buildingId: building._id });
            if (rooms.length === 0) {
                // If no rooms found, create them
                const numberOfRooms = building.numberOfRooms;
                for (let i = 1; i <= numberOfRooms; i++) {
                    const newRoom = new Room({
                        buildingId: building._id,
                        roomNumber: i,
                        buildingName: buildingName,
                        numOfRooms: 1,
                        numBeds: Math.floor(Math.random() * 4) + 1, // Example random number of beds
                        floor: Math.floor(Math.random() * 4) + 1 // Example random floor number
                    });
                    await newRoom.save();
                }
                rooms = await Room.find({ buildingId: building._id });
            }
            else {
                console.log('The building and the rooms is already reserved.');
            }

            res.status(200).json({ rooms });
        } catch (error) {
            console.error('Error fetching or creating rooms:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },
    SubmitOrder: async function (req, res) {
        try {
            const { buildingName, roomNumber, clientId, name, email, phoneNumber, startDate, endDate, guestsNum, nightNumbers, isFree } = req.body;
            const building = await Building.findOne({ buildingName });

            if (!building) {
                return res.status(404).json({ message: 'Building not found' });
            }
            let buildingId = building._id;
            let room = await Room.find({ buildingId, roomNumber });
            let roomId = room[0]._id;

            // Create or update client
            let client = await Client.findOne({ clientId });
            if (!client) {
                client = new Client({
                    clientId: clientId,
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber
                });
            }
            // if (!client) {
            //     console.log('Error: Client not found.');
            // } else {
            //     console.log('Client updated or created:', client);
            //     await client.save(); // Save the client to the database
            // }
            // Create order
            const newOrder = new Order({
                clientId: clientId,
                guestsNum: guestsNum,
                startDate: startDate,
                endDate: endDate,
                nightNumbers: nightNumbers,
                isFree,
                email: email,
                rooms: [{ roomId, buildingId }]
            });

            if (!newOrder || !client) {
                console.log('\n----newOrder----\n', newOrder);
                console.log('\n----client----\n', client);
                console.log('Error: newOrder or client not found.');
            } else {
                console.log('sucseesfully to save the order and client');
                await newOrder.save(); // Save the newOrder to the database
                await client.save(); // Save the client to the database
            }

            // Update room status
            // await RoomStatus.findOneAndUpdate(
            //     { rooms: [room, building] },
            //     { $set: { status: 'occupied', startDate: startDate, nightNumbers } },
            //     { new: true, upsert: true }
            // );

            // res.status(200).send({ message: 'Order submitted successfully!' });
        } catch (error) {
            console.error('Error submitting order:', error);
            res.status(500).send({ message: 'Failed to submit order. Please try again.' });
        }
    }
};