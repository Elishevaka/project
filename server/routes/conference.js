const Client = require('../models/client.js')
const RoomStatus = require('../models/roomBooking.js')
const Room = require('../models/room.js')
const Building = require('../models/building.js')
const Order = require('../models/order.js')
const Login = require('../models/login.js');

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

    LoginScript: async function (req, res) {
        const { username, password } = req.body;
        try {
            // Find the user by username
            const userDB = await Login.findOne({ username });

            if (!userDB) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            if (password === userDB.password) {
                // Authentication successful
                return res.status(200).json({ message: 'Login successful' });
            } else {
                // Authentication failed
                return res.status(401).json({ message: 'Invalid username or password' });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error, please try again later.' });
        }
    },

    //////////////////////////////////////////////////////////// start
    AddRoom: async function (req, res) {
        const { roomNumber, buildingName, numOfRooms, numBeds, floor } = req.body;

        try {
            // Check if the building exists by name
            let building = await Building.findOne({ buildingName: buildingName.trim() });

            if (building) {
                // Check if the room already exists in the building
                const existingRoom = await Room.findOne({
                    roomNumber: roomNumber,
                    buildingId: building._id
                });
                // if (!existingRoom) {                    
                //     building.numberOfRooms += 1;
                //     await building.save();
                // }

                if (existingRoom) {
                    return res.status(400).json({ error: 'Room already exists in this building.' });
                }

                // Add new room to the existing building
                const newRoom = new Room({
                    roomNumber: roomNumber,
                    buildingId: building._id,
                    buildingName: building.buildingName,
                    numOfRooms: numOfRooms,
                    numBeds: numBeds,
                    floor: floor
                });

                await newRoom.save();
                building.numberOfRooms += 1;
                await building.save();
                return res.status(200).json({ message: `Room ${roomNumber} added to ${buildingName} successfully!` });

            } else {
                // Create new building if it doesn't exist
                const newBuilding = new Building({
                    buildingName: buildingName.trim(),
                    numberOfRooms: numOfRooms
                });

                await newBuilding.save();

                // Add the new room to the newly created building
                const newRoom = new Room({
                    roomNumber: roomNumber,
                    buildingId: newBuilding._id,
                    buildingName: newBuilding.buildingName,
                    numOfRooms: numOfRooms,
                    numBeds: numBeds,
                    floor: floor
                });

                await newRoom.save();
                return res.status(200).json({ message: `Building ${buildingName} and room ${roomNumber} created successfully!` });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },
    GetAllRooms: async function (req, res) {
        try {
            const rooms = await Room.find().populate('buildingId', 'buildingName'); // Only populate buildingName
            return res.status(200).json(rooms); // Return rooms with building info
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching rooms.' });
        }
    },
    DeleteRoom: async function (req, res) {
        const { roomId } = req.params;

        try {
            // Find the room by its ID
            const room = await Room.findById(roomId);

            if (!room) {
                return res.status(404).json({ error: 'Room not found.' });
            }

            // Find the associated building and decrement its numberOfRooms
            const building = await Building.findById(room.buildingId);

            if (building) {
                building.numberOfRooms -= 1;
                await building.save();
            }

            // Delete the room from the database
            await Room.findByIdAndDelete(roomId);

            res.status(200).json({ message: `Room ${room.roomNumber} from ${room.buildingName} deleted successfully!` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },
    // Update Room
    UpdateRoom: async function (req, res) {
        const roomId = req.params.id;
        const { roomNumber, numBeds, floor, numOfRooms } = req.body;

        try {
            // Find the room and update it
            const updatedRoom = await Room.findByIdAndUpdate(roomId, {
                roomNumber,
                numBeds,
                floor,
                numOfRooms
            }, { new: true });

            if (!updatedRoom) {
                return res.status(404).json({ error: 'Room not found' });
            }

            res.status(200).json({ message: 'Room updated successfully', updatedRoom });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },
    updateRoom: async function (req, res) {
        const { id } = req.params;
        const { roomNumber, numBeds, floor, numOfRooms } = req.body;

        try {
            const updatedRoom = await Room.findByIdAndUpdate(
                id,
                { roomNumber, numBeds, floor, numOfRooms },
                { new: true }
            );
            if (!updatedRoom) {
                return res.status(404).json({ error: 'Room not found.' });
            }
            res.status(200).json({ message: 'Room updated successfully' });
        } catch (error) {
            console.error('Error updating room:', error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },

    ///////////////////////////////
};